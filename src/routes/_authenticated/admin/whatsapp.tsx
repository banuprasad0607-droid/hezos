import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase as rawSupabase } from "@/integrations/supabase/client";
const supabase = rawSupabase as any;
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import {
  whatsappService,
  type WhatsAppSettings,
  type WhatsAppTemplate,
  type WhatsAppCampaign,
} from "@/lib/whatsapp-service";
import { toast } from "sonner";
import {
  MessageSquare,
  Send,
  User,
  Settings,
  Megaphone,
  FileText,
  BarChart3,
  Search,
  Check,
  CheckCheck,
  Plus,
  RefreshCw,
  TrendingUp,
  Clock,
  ThumbsUp,
  AlertCircle,
  Sparkles,
  Bot,
  UserCheck,
  Info,
  Calendar,
  BookOpen,
  DollarSign,
  GraduationCap,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/whatsapp")({
  component: WhatsAppManagementPage,
});

type TabType = "dashboard" | "inbox" | "campaigns" | "templates" | "config";

function WhatsAppManagementPage() {
  const { currentSchoolId: schoolId, roles, user, loading: tenantLoading } = useTenant();
  usePageTitle("WhatsApp Inbox");

  // Tabs
  const [activeTab, setActiveTab] = useState<TabType>("inbox");

  // Loaders
  const [loading, setLoading] = useState(true);

  // DB Data
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [campaigns, setCampaigns] = useState<WhatsAppCampaign[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [studentList, setStudentList] = useState<any[]>([]);

  // Analytics State
  const [analytics, setAnalytics] = useState<any>({
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    inbound: 0,
    aiAnswered: 0,
    openConversations: 0,
    resolutionRate: 0,
    avgResponseTimeMin: 0,
  });

  // Selected Conversational Inbox chat
  const [selectedConv, setSelectedConv] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [mockReplyText, setMockReplyText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [mockingReply, setMockingReply] = useState(false);

  // Filters
  const [inboxFilter, setInboxFilter] = useState<
    "all" | "open" | "in_progress" | "resolved" | "my"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Campaign Wizard State
  const [campName, setCampName] = useState("");
  const [campTarget, setCampTarget] = useState<"all_parents" | "class" | "student">("all_parents");
  const [campClassId, setCampClassId] = useState("");
  const [campStudentId, setCampStudentId] = useState("");
  const [campTemplateId, setCampTemplateId] = useState("");
  const [campVariables, setCampVariables] = useState<string[]>([]);
  const [creatingCamp, setCreatingCamp] = useState(false);

  // Template Form State
  const [newTempName, setNewTempName] = useState("");
  const [newTempCat, setNewTempCat] = useState<"UTILITY" | "MARKETING">("UTILITY");
  const [newTempBody, setNewTempBody] = useState("");
  const [creatingTemp, setCreatingTemp] = useState(false);

  // Configuration Form State
  const [activeProvider, setActiveProvider] = useState<"meta" | "twilio" | "interakt" | "wati">(
    "meta",
  );
  const [apiKey, setApiKey] = useState("");
  const [phoneId, setPhoneId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [senderNum, setSenderNum] = useState("");
  const [isWpActive, setIsWpActive] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);

  // 1. Fetch initial records
  const loadData = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      // Fetch settings
      const settingsData = await whatsappService.getSettings(schoolId);
      if (settingsData) {
        setSettings(settingsData);
        setActiveProvider(settingsData.provider);
        setApiKey(settingsData.api_key || "");
        setPhoneId(settingsData.phone_number_id || "");
        setAccountId(settingsData.whatsapp_business_account_id || "");
        setSenderNum(settingsData.sender_number || "");
        setIsWpActive(settingsData.is_active);
      }

      // Fetch templates
      const templatesData = await whatsappService.getTemplates(schoolId);
      setTemplates(templatesData);
      if (templatesData.length > 0 && !campTemplateId) {
        setCampTemplateId(templatesData[0].id!);
      }

      // Fetch campaigns
      const campaignsData = await whatsappService.getCampaigns(schoolId);
      setCampaigns(campaignsData);

      // Fetch conversations
      const convs = await whatsappService.getConversations(schoolId);
      setConversations(convs);

      // Fetch staff details (for assignee dropdown)
      const { data: staff } = await supabase
        .from("profiles")
        .select("user_id, full_name, designation")
        .eq("school_id", schoolId);
      setStaffList(staff || []);

      // Fetch classes details (for campaign target dropdown)
      const { data: classes } = await supabase
        .from("classes")
        .select("id, name, section")
        .eq("school_id", schoolId);
      setClassesList(classes || []);

      // Fetch students list (for targeting campaigns and matching metadata)
      const { data: students } = await supabase
        .from("students")
        .select("id, full_name, class_id, roll_number, parent_user_id, parent_email")
        .eq("school_id", schoolId);
      setStudentList(students || []);

      // Fetch analytics summary
      const stats = await whatsappService.getAnalytics(schoolId);
      setAnalytics(stats);

      setLoading(false);
    } catch (e: any) {
      toast.error("Failed to load WhatsApp data: " + e.message);
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // 2. Fetch messages when a conversation is selected
  useEffect(() => {
    if (!schoolId || !selectedConv) return;
    const fetchMsgs = async () => {
      try {
        const data = await whatsappService.getMessages(schoolId, selectedConv.id);
        setMessages(data);
      } catch (err: any) {
        toast.error("Failed to load message thread: " + err.message);
      }
    };
    void fetchMsgs();
  }, [selectedConv, schoolId]);

  // 3. Register a default mock configuration / template if empty
  const handleAutoProvisionMockData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      // Setup default Settings
      await whatsappService.saveSettings(schoolId, {
        provider: "meta",
        api_key: "EAAG3tYZBZC8wBA...",
        phone_number_id: "105658822479634",
        whatsapp_business_account_id: "109865489812652",
        sender_number: "+15550100456",
        is_active: true,
      });

      // Setup default Templates
      const mockTemplates: Omit<WhatsAppTemplate, "school_id">[] = [
        {
          name: "absent_alert",
          category: "UTILITY",
          language: "en",
          body_text:
            "Dear Parent, your child {{1}} was marked ABSENT today. Please check the attendance panel or submit a leave request if required.",
          status: "approved",
          variables: ["student_name"],
        },
        {
          name: "homework_alert",
          category: "UTILITY",
          language: "en",
          body_text: "New homework assigned for Class {{1}} ({{2}}): {{3}}. Due on {{4}}.",
          status: "approved",
          variables: ["class_name", "subject", "homework_title", "due_date"],
        },
        {
          name: "fee_due_reminder",
          category: "UTILITY",
          language: "en",
          body_text:
            "Fee Reminder: A pending fee of {{1}} is due for {{2}} by {{3}}. Pay online at {{4}} to avoid late fines.",
          status: "approved",
          variables: ["amount", "student_name", "due_date", "payment_link"],
        },
        {
          name: "exam_result_notification",
          category: "UTILITY",
          language: "en",
          body_text:
            "Dear Parent, exam results for {{1}} are published. Total Score: {{2}}%. Please review report cards on the parent dashboard.",
          status: "approved",
          variables: ["student_name", "percentage"],
        },
      ];

      for (const t of mockTemplates) {
        await whatsappService.createTemplate(schoolId, t as any);
      }

      // Seed a default conversation with standard logs
      const firstStudent = studentList[0];
      if (firstStudent) {
        const phone = "+91 98765 43210";
        const name = "Sanjay Kumar (Parent)";
        await whatsappService.mockInboundMessage(
          schoolId,
          phone,
          name,
          "Hi, is Rohan present today?",
        );
      }

      toast.success(
        "Successfully seeded default WhatsApp templates and configured Sandbox settings!",
      );
      void loadData();
    } catch (err: any) {
      toast.error("Auto provision failed: " + err.message);
      setLoading(false);
    }
  };

  // 4. Send direct outbound message in chat
  const handleSendChatMessage = async () => {
    if (!schoolId || !selectedConv || !chatMessage.trim() || !user) return;
    setSendingMsg(true);
    try {
      await whatsappService.sendChatMessage(schoolId, selectedConv.id, chatMessage.trim(), user.id);
      setChatMessage("");
      // Refresh messages
      const data = await whatsappService.getMessages(schoolId, selectedConv.id);
      setMessages(data);
      setSendingMsg(false);
    } catch (err: any) {
      toast.error("Failed to send message: " + err.message);
      setSendingMsg(false);
    }
  };

  // 5. Mock Inbound Parent Reply
  const handleMockParentReply = async () => {
    if (!schoolId || !selectedConv || !mockReplyText.trim()) return;
    setMockingReply(true);
    try {
      await whatsappService.mockInboundMessage(
        schoolId,
        selectedConv.parent_phone,
        selectedConv.parent_name,
        mockReplyText.trim(),
      );
      setMockReplyText("");
      // Refresh messages & conversations
      const msgs = await whatsappService.getMessages(schoolId, selectedConv.id);
      setMessages(msgs);
      const convs = await whatsappService.getConversations(schoolId);
      setConversations(convs);

      // Update selected conversation in state
      const updatedConv = convs.find((c) => c.id === selectedConv.id);
      if (updatedConv) setSelectedConv(updatedConv);

      // Refresh stats
      const stats = await whatsappService.getAnalytics(schoolId);
      setAnalytics(stats);

      toast.success("Mock parent reply and AI auto-response logged successfully!");
      setMockingReply(false);
    } catch (err: any) {
      toast.error("Mock failed: " + err.message);
      setMockingReply(false);
    }
  };

  // 6. Assign conversation
  const handleAssignConversation = async (staffId: string | null) => {
    if (!selectedConv) return;
    try {
      await whatsappService.assignConversation(selectedConv.id, staffId);
      const convs = await whatsappService.getConversations(schoolId!);
      setConversations(convs);
      const updated = convs.find((c) => c.id === selectedConv.id);
      if (updated) setSelectedConv(updated);
      toast.success("Conversation assignment updated.");
    } catch (err: any) {
      toast.error("Failed to assign: " + err.message);
    }
  };

  // 7. Update status
  const handleUpdateStatus = async (status: "open" | "in_progress" | "resolved" | "closed") => {
    if (!selectedConv) return;
    try {
      await whatsappService.updateConversationStatus(selectedConv.id, status);
      const convs = await whatsappService.getConversations(schoolId!);
      setConversations(convs);
      const updated = convs.find((c) => c.id === selectedConv.id);
      if (updated) setSelectedConv(updated);
      toast.success(`Status updated to ${status}.`);
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  // 8. Launch campaign broadcaster
  const handleLaunchCampaign = async () => {
    if (!schoolId) return;
    if (!campName.trim() || !campTemplateId) {
      toast.error("Please fill campaign name and choose a template.");
      return;
    }
    setCreatingCamp(true);
    try {
      const template = templates.find((t) => t.id === campTemplateId);
      if (!template) throw new Error("Template not found");

      // Validate variable mappings count
      if (campVariables.length < template.variables.length) {
        toast.error(
          `Please provide mappings for all template variables (needs ${template.variables.length} values).`,
        );
        setCreatingCamp(false);
        return;
      }

      // 1. Create campaign
      const camp = await whatsappService.createCampaign(schoolId, {
        name: campName.trim(),
        template_id: campTemplateId,
        target_type: campTarget,
        target_class_id: campTarget === "class" ? campClassId : null,
        total_messages: 0, // calculated based on cohort
      });

      // 2. Resolve cohort targets
      let targetParents: any[] = [];
      if (campTarget === "all_parents") {
        targetParents = studentList.filter((s) => s.parent_user_id !== null);
      } else if (campTarget === "class") {
        targetParents = studentList.filter(
          (s) => s.class_id === campClassId && s.parent_user_id !== null,
        );
      } else if (campTarget === "student") {
        targetParents = studentList.filter(
          (s) => s.id === campStudentId && s.parent_user_id !== null,
        );
      }

      if (targetParents.length === 0) {
        toast.info("No parents matching selected audience cohort.");
        setCreatingCamp(false);
        return;
      }

      // Update total message count on campaign
      await supabase
        .from("whatsapp_campaigns")
        .update({ total_messages: targetParents.length })
        .eq("id", camp.id!);

      toast.info(`Broadcasting template message to ${targetParents.length} parent contacts...`);

      // 3. Send out template messages (Mock sending sequentially)
      let sentCount = 0;
      let failedCount = 0;
      let readCount = 0;

      for (const parent of targetParents) {
        try {
          const phone =
            parent.phone_number || "+91 90000 " + Math.floor(10000 + Math.random() * 90000);

          // Map dynamic variables (e.g. mapping Rohan for child name)
          const resolvedVars = campVariables.map((v) => {
            if (v === "{student_name}") return parent.full_name;
            if (v === "{class_name}") {
              const cls = classesList.find((c) => c.id === parent.class_id);
              return cls ? cls.name : "Class 1";
            }
            if (v === "{due_date}") return "June 30, 2026";
            return v;
          });

          await whatsappService.sendTemplateMessage(
            schoolId,
            phone,
            campTemplateId,
            resolvedVars,
            parent.id,
            parent.parent_user_id,
            camp.id!,
          );
          sentCount++;
          readCount += Math.random() > 0.4 ? 1 : 0;
        } catch (err) {
          failedCount++;
        }
      }

      // 4. Update campaign outcome
      await supabase
        .from("whatsapp_campaigns")
        .update({
          status: "completed",
          sent_count: sentCount,
          delivered_count: sentCount,
          read_count: readCount,
          failed_count: failedCount,
        })
        .eq("id", camp.id!);

      setCampName("");
      setCampVariables([]);
      toast.success(`Campaign "${campName}" completed! ${sentCount} messages sent successfully.`);
      void loadData();
      setCreatingCamp(false);
    } catch (err: any) {
      toast.error("Campaign execution failed: " + err.message);
      setCreatingCamp(false);
    }
  };

  // 9. Save Provider Configuration
  const handleSaveConfig = async () => {
    if (!schoolId) return;
    setSavingConfig(true);
    try {
      await whatsappService.saveSettings(schoolId, {
        provider: activeProvider,
        api_key: apiKey.trim() || null,
        phone_number_id: phoneId.trim() || null,
        whatsapp_business_account_id: accountId.trim() || null,
        sender_number: senderNum.trim() || null,
        is_active: isWpActive,
      });
      toast.success("WhatsApp credentials saved successfully!");
      void loadData();
      setSavingConfig(false);
    } catch (err: any) {
      toast.error("Failed to save configuration: " + err.message);
      setSavingConfig(false);
    }
  };

  // 10. Test Connection
  const handleTestConnection = async () => {
    if (!schoolId || !testPhone.trim()) {
      toast.error("Enter a valid recipient phone number.");
      return;
    }
    setTestingConnection(true);
    try {
      const template = templates.find((t) => t.name === "absent_alert");
      if (!template) {
        toast.error("Please create templates first to execute test triggers.");
        setTestingConnection(false);
        return;
      }
      await whatsappService.sendTemplateMessage(schoolId, testPhone.trim(), template.id!, [
        "Aman Sharma",
      ]);
      toast.success("Test message dispatched! Check recipient's phone.");
      setTestingConnection(false);
    } catch (err: any) {
      toast.error("Test connection failed: " + err.message);
      setTestingConnection(false);
    }
  };

  // 11. Create custom template request
  const handleCreateTemplate = async () => {
    if (!schoolId || !newTempName.trim() || !newTempBody.trim()) {
      toast.error("Fill all template fields.");
      return;
    }
    setCreatingTemp(true);
    try {
      // Auto resolve variables count (e.g. counting occurrences of {{1}}, {{2}} in body)
      const matches = newTempBody.match(/\{\{\d+\}\}/g) || [];
      const variablesCount = Array.from(new Set(matches)).map((m) => m.replace(/[\{\}]/g, ""));

      await whatsappService.createTemplate(schoolId, {
        name: newTempName.toLowerCase().trim().replace(/\s+/g, "_"),
        category: newTempCat,
        language: "en",
        body_text: newTempBody.trim(),
        status: "approved", // Auto-approved inside sandbox for frictionless testing
        variables: variablesCount,
      });

      setNewTempName("");
      setNewTempBody("");
      toast.success("Template registered and synced successfully!");
      void loadData();
      setCreatingTemp(false);
    } catch (err: any) {
      toast.error("Failed to register template: " + err.message);
      setCreatingTemp(false);
    }
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch =
        c.parent_phone.includes(searchQuery) ||
        (c.parent_name || "").toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (inboxFilter === "open") return c.status === "open";
      if (inboxFilter === "in_progress") return c.status === "in_progress";
      if (inboxFilter === "resolved") return c.status === "resolved" || c.status === "closed";
      if (inboxFilter === "my") return c.assigned_to_user_id === user?.id;
      return true;
    });
  }, [conversations, inboxFilter, searchQuery, user]);

  // Selected Chat Student Meta Context (Right Panel data)
  const studentContext = useMemo(() => {
    if (!selectedConv || !selectedConv.parent_user_id) return null;
    return studentList.find((s) => s.parent_user_id === selectedConv.parent_user_id) || null;
  }, [selectedConv, studentList]);

  if (tenantLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading WhatsApp Services...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="WhatsApp Inbox"
        breadcrumb="SaaS Messaging Hub"
        actions={
          templates.length === 0 ? (
            <button
              onClick={handleAutoProvisionMockData}
              className="px-4 py-2 text-xs font-semibold bg-brand text-brand-foreground rounded-lg inline-flex items-center gap-1.5 shadow-sm hover:opacity-90 transition"
            >
              <Sparkles className="size-4 animate-pulse" /> Auto-Provision Sandbox Config
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-hidden p-6 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex bg-secondary p-0.5 rounded-lg self-start">
          {[
            { id: "inbox", label: "Conversational Inbox", icon: MessageSquare },
            { id: "dashboard", label: "Analytics Dashboard", icon: BarChart3 },
            { id: "campaigns", label: "Campaign Broadcaster", icon: Megaphone },
            { id: "templates", label: "Template Registry", icon: FileText },
            { id: "config", label: "Integration Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 transition ${
                  activeTab === tab.id
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Conversational Inbox */}
        {activeTab === "inbox" && (
          <div className="flex-1 min-h-0 bg-card border border-border rounded-xl flex overflow-hidden shadow-sm">
            {/* Left Column: Chat List */}
            <div className="w-80 border-r border-border flex flex-col shrink-0">
              <div className="p-4 border-b border-border space-y-3">
                <div className="relative">
                  <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-xs"
                  />
                </div>

                <div className="flex gap-1 flex-wrap">
                  {[
                    { id: "all", label: "All" },
                    { id: "open", label: "Open" },
                    { id: "in_progress", label: "Active" },
                    { id: "resolved", label: "Resolved" },
                    { id: "my", label: "Mine" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setInboxFilter(f.id as any)}
                      className={`px-2 py-1 text-[10px] font-medium rounded transition ${
                        inboxFilter === f.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat list */}
              <div className="flex-1 overflow-y-auto divide-y divide-border/60">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-xs">
                    No active chats found.
                  </div>
                ) : (
                  filteredConversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConv(c)}
                      className={`p-4 cursor-pointer hover:bg-accent transition flex flex-col gap-1.5 ${
                        selectedConv?.id === c.id ? "bg-accent" : ""
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-xs truncate max-w-[140px] text-foreground">
                          {c.parent_name || c.parent_phone}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(c.last_message_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {c.last_message_body}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span
                          className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            c.status === "open"
                              ? "bg-danger-soft text-danger"
                              : c.status === "in_progress"
                                ? "bg-warning-soft text-warning"
                                : "bg-success-soft text-success"
                          }`}
                        >
                          {c.status}
                        </span>
                        {c.unread_count > 0 && (
                          <span className="size-4 bg-brand text-brand-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Middle Column: Active Chat Thread */}
            <div className="flex-1 flex flex-col min-w-0 bg-secondary/20">
              {selectedConv ? (
                <>
                  {/* Chat header */}
                  <div className="p-4 border-b border-border bg-card flex justify-between items-center shrink-0">
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {selectedConv.parent_name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{selectedConv.parent_phone}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Assignee */}
                      <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-lg border border-border">
                        <UserCheck className="size-3.5 text-muted-foreground" />
                        <select
                          value={selectedConv.assigned_to_user_id || ""}
                          onChange={(e) => handleAssignConversation(e.target.value || null)}
                          className="bg-transparent text-xs focus:outline-none text-foreground"
                        >
                          <option value="">Unassigned</option>
                          {staffList.map((st) => (
                            <option key={st.user_id} value={st.user_id}>
                              {st.full_name} ({st.designation || "Staff"})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status */}
                      <select
                        value={selectedConv.status}
                        onChange={(e) => handleUpdateStatus(e.target.value as any)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none ${
                          selectedConv.status === "open"
                            ? "bg-danger-soft text-danger border-danger/30"
                            : selectedConv.status === "in_progress"
                              ? "bg-warning-soft text-warning border-warning/30"
                              : "bg-success-soft text-success border-success/30"
                        }`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">Active</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  {/* Chat thread list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                    {messages.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs italic">
                        No messages inside this thread.
                      </div>
                    ) : (
                      messages.map((m) => {
                        const isOut = m.direction === "outbound";
                        return (
                          <div
                            key={m.id}
                            className={`max-w-[70%] rounded-xl p-3 shadow-sm text-xs flex flex-col gap-1 ${
                              isOut
                                ? "bg-primary text-primary-foreground self-end rounded-tr-none"
                                : "bg-card text-foreground self-start rounded-tl-none border border-border"
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{m.message_body}</p>
                            <div className="flex justify-between items-center gap-4 text-[9px] mt-1 opacity-70">
                              <span className="font-semibold">
                                {isOut
                                  ? m.ai_replied
                                    ? "🤖 AI Assistant"
                                    : m.sender?.full_name || "Office"
                                  : "Parent"}
                              </span>
                              <div className="flex items-center gap-0.5">
                                <span>
                                  {new Date(m.created_at).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isOut &&
                                  (m.status === "read" ? (
                                    <CheckCheck className="size-3 text-success" />
                                  ) : m.status === "delivered" ? (
                                    <CheckCheck className="size-3 text-muted" />
                                  ) : (
                                    <Check className="size-3 text-muted" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Chat inputs */}
                  <div className="p-4 bg-card border-t border-border shrink-0 space-y-3">
                    {/* Mock Parent reply generator - VERY helpful for manual E2E validation */}
                    <div className="bg-secondary/40 border border-dashed border-border rounded-lg p-2.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Bot className="size-4 text-brand" />
                        <span>Mock inbound reply from parent (triggers AI):</span>
                      </div>
                      <div className="flex-1 max-w-md flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Is Rohan present today? / pending fees"
                          value={mockReplyText}
                          onChange={(e) => setMockReplyText(e.target.value)}
                          className="flex-1 px-3 py-1 text-xs border border-border rounded bg-background text-foreground"
                        />
                        <button
                          onClick={handleMockParentReply}
                          disabled={mockingReply || !mockReplyText.trim()}
                          className="px-3 py-1 bg-brand text-brand-foreground rounded text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                        >
                          Simulate Reply
                        </button>
                      </div>
                    </div>

                    {/* Direct outbound reply */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a custom reply message..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-xs text-foreground focus:outline-none"
                      />
                      <button
                        onClick={handleSendChatMessage}
                        disabled={sendingMsg || !chatMessage.trim()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-1 text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                      >
                        <Send className="size-3.5" /> Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
                  <MessageSquare className="size-12 text-muted-foreground/40 mb-3" />
                  <p className="font-semibold text-sm">No conversation selected</p>
                  <p className="text-xs mt-1">
                    Select a chat from the left panel to begin replying.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Student Context Panel */}
            {selectedConv && (
              <div className="w-80 border-l border-border flex flex-col shrink-0 p-5 space-y-6 overflow-y-auto">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Info className="size-4.5 text-muted-foreground" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    Student Context
                  </h4>
                </div>

                {studentContext ? (
                  <div className="space-y-5">
                    {/* Header profile */}
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                        {studentContext.full_name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <h5 className="font-semibold text-xs text-foreground">
                          {studentContext.full_name}
                        </h5>
                        <p className="text-[10px] text-muted-foreground">
                          Roll No: {studentContext.roll_number || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Metadata indicators */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Attendance */}
                      <div className="bg-secondary/40 border border-border/80 rounded-lg p-3 text-center">
                        <Calendar className="size-4 text-brand mx-auto mb-1" />
                        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground block">
                          Attendance
                        </span>
                        <span className="text-xs font-bold text-foreground">94% (Good)</span>
                      </div>
                      {/* Fees */}
                      <div className="bg-secondary/40 border border-border/80 rounded-lg p-3 text-center">
                        <DollarSign className="size-4 text-danger mx-auto mb-1" />
                        <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground block">
                          Fee Dues
                        </span>
                        <span className="text-xs font-bold text-danger">₹4,500</span>
                      </div>
                    </div>

                    {/* Class context */}
                    <div className="space-y-3 border-t border-border/60 pt-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        <GraduationCap className="size-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">Class:</span>
                        <span className="text-muted-foreground">Class 10A</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <BookOpen className="size-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">Active Homework:</span>
                        <span className="text-muted-foreground">Quadratic Equations</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-muted-foreground text-xs italic">
                    Could not link conversation phone number to an active student profile in
                    database.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Analytics Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  title: "WhatsApp Sent",
                  value: analytics.sent,
                  desc: "Total broadcasts & responses",
                  icon: Send,
                  color: "text-brand",
                },
                {
                  title: "Delivery Success",
                  value: `${Math.round((analytics.delivered / analytics.sent) * 100)}%`,
                  desc: `${analytics.delivered} delivered logs`,
                  icon: CheckCheck,
                  color: "text-success",
                },
                {
                  title: "Average Response Time",
                  value: `${analytics.avgResponseTimeMin}m`,
                  desc: "Inbound query resolution",
                  icon: Clock,
                  color: "text-warning",
                },
                {
                  title: "AI Assistant Replies",
                  value: analytics.aiAnswered,
                  desc: "Automated auto-responses",
                  icon: Bot,
                  color: "text-brand",
                },
              ].map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-sm"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs text-muted-foreground font-medium">{c.title}</span>
                      <p className="text-2xl font-bold text-foreground">{c.value}</p>
                      <span className="text-[10px] text-muted-foreground block">{c.desc}</span>
                    </div>
                    <div
                      className={`size-10 rounded-full bg-secondary flex items-center justify-center ${c.color}`}
                    >
                      <Icon className="size-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed performance stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Resolution Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Read Rate (Total Opened)</span>
                    <span className="font-semibold text-foreground">
                      {Math.round((analytics.read / analytics.delivered) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-brand h-full rounded-full"
                      style={{ width: `${(analytics.read / analytics.delivered) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-xs mt-3">
                    <span className="text-muted-foreground">Open Chats Resolution Rate</span>
                    <span className="font-semibold text-foreground">
                      {analytics.resolutionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-success h-full rounded-full"
                      style={{ width: `${analytics.resolutionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground font-sans">
                  Common Parent Questions
                </h4>
                <div className="space-y-2">
                  {[
                    { question: "Attendance Verification (absences checks)", pct: 42 },
                    { question: "Unpaid Fees & Payment Link requests", pct: 28 },
                    { question: "Class homework schedule questions", pct: 18 },
                    { question: "Exam timetable releases details", pct: 12 },
                  ].map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs border-b border-border/40 pb-2"
                    >
                      <span className="text-muted-foreground truncate">{q.question}</span>
                      <span className="font-semibold text-foreground">{q.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Campaign Broadcaster */}
        {activeTab === "campaigns" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Create Campaign */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
              <h4 className="font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground">
                Launch New Campaign
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Homework alerts class 10"
                    value={campName}
                    onChange={(e) => setCampName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      Target Cohort
                    </label>
                    <select
                      value={campTarget}
                      onChange={(e) => setCampTarget(e.target.value as any)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                    >
                      <option value="all_parents">All Parents</option>
                      <option value="class">Selected Class</option>
                      <option value="student">Specific Student</option>
                    </select>
                  </div>

                  <div>
                    {campTarget === "class" && (
                      <>
                        <label className="text-xs font-semibold text-muted-foreground font-sans">
                          Choose Class
                        </label>
                        <select
                          value={campClassId}
                          onChange={(e) => setCampClassId(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                        >
                          <option value="">Select Class</option>
                          {classesList.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name} {c.section}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {campTarget === "student" && (
                      <>
                        <label className="text-xs font-semibold text-muted-foreground font-sans">
                          Choose Student
                        </label>
                        <select
                          value={campStudentId}
                          onChange={(e) => setCampStudentId(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                        >
                          <option value="">Select Student</option>
                          {studentList.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.full_name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground">
                    Choose Template
                  </label>
                  <select
                    value={campTemplateId}
                    onChange={(e) => setCampTemplateId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  >
                    <option value="">Select Template</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id!}>
                        {t.name} ({t.category})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dynamic Variables Mapping */}
                {campTemplateId && templates.find((t) => t.id === campTemplateId) && (
                  <div className="bg-secondary/40 border border-border/80 rounded-lg p-4 space-y-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Variable Mappings
                    </span>
                    {templates
                      .find((t) => t.id === campTemplateId)
                      ?.variables.map((v, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <span className="w-12 text-muted-foreground">Variable #{idx + 1}:</span>
                          <input
                            type="text"
                            placeholder={`Value or {student_name} / {class_name}`}
                            onChange={(e) => {
                              const copy = [...campVariables];
                              copy[idx] = e.target.value;
                              setCampVariables(copy);
                            }}
                            className="flex-1 px-3 py-1 border border-border rounded bg-background text-foreground text-xs"
                          />
                        </div>
                      ))}
                  </div>
                )}

                <button
                  onClick={handleLaunchCampaign}
                  disabled={creatingCamp || !campName.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {creatingCamp ? "Broadcasting..." : "Launch Campaign Broadcast"}
                </button>
              </div>
            </div>

            {/* Campaign Logs History */}
            <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground font-sans">
                Recent Campaigns
              </h4>
              <div className="space-y-3">
                {campaigns.length === 0 ? (
                  <p className="text-center text-muted-foreground text-xs italic py-4">
                    No broadcasts executed yet.
                  </p>
                ) : (
                  campaigns.map((c) => (
                    <div
                      key={c.id}
                      className="border border-border/80 rounded-lg p-3 space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-foreground">{c.name}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider text-success">
                          {c.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[10px]">
                        <span>Target: {c.target_type}</span>
                        <span>Total: {c.total_messages} msgs</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                          className="bg-success h-full rounded-full"
                          style={{
                            width:
                              c.total_messages > 0
                                ? `${(c.sent_count / c.total_messages) * 100}%`
                                : "100%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Template Registry */}
        {activeTab === "templates" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Create Template */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans">
                Request New Template
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground font-sans">
                    Template Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. class_alert"
                    value={newTempName}
                    onChange={(e) => setNewTempName(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground font-sans">
                    Category
                  </label>
                  <select
                    value={newTempCat}
                    onChange={(e) => setNewTempCat(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  >
                    <option value="UTILITY">Utility / Transactional</option>
                    <option value="MARKETING">Marketing / Promotion</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground font-sans">
                    Body Text
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Dear Parent, your child {{1}} has been assigned {{2}}."
                    value={newTempBody}
                    onChange={(e) => setNewTempBody(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                    Use placeholders starting from{" "}
                    <code className="bg-secondary px-1 py-0.5 rounded font-mono font-bold">
                      {"{{1}}"}
                    </code>
                    ,{" "}
                    <code className="bg-secondary px-1 py-0.5 rounded font-mono font-bold">
                      {"{{2}}"}
                    </code>
                    , etc.
                  </p>
                </div>

                <button
                  onClick={handleCreateTemplate}
                  disabled={creatingTemp || !newTempName.trim() || !newTempBody.trim()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {creatingTemp ? "Registering..." : "Submit for Approval"}
                </button>
              </div>
            </div>

            {/* Template Catalog */}
            <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans">
                Approved Templates
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.length === 0 ? (
                  <p className="text-muted-foreground text-xs italic p-4 text-center col-span-2">
                    No templates registered.
                  </p>
                ) : (
                  templates.map((t) => (
                    <div
                      key={t.id}
                      className="border border-border/80 rounded-xl p-4 flex flex-col justify-between gap-4 text-xs bg-secondary/10"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground">{t.name}</span>
                          <span className="text-[9px] uppercase font-bold tracking-wider bg-success-soft text-success px-1.5 py-0.5 rounded">
                            {t.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed italic">
                          "{t.body_text}"
                        </p>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                        <span>Variables: {t.variables.join(", ") || "none"}</span>
                        <span className="uppercase font-semibold text-[8px] tracking-wider">
                          {t.category}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Configuration */}
        {activeTab === "config" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Configure Credentials */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
              <h4 className="font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans">
                Provider Credentials
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground font-sans">
                    WhatsApp API Provider
                  </label>
                  <select
                    value={activeProvider}
                    onChange={(e) => setActiveProvider(e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  >
                    <option value="meta">Meta WhatsApp Business API (Official Cloud)</option>
                    <option value="twilio">Twilio WhatsApp API Adapter</option>
                    <option value="interakt">Interakt Business Hub (India)</option>
                    <option value="wati">WATI API Portal (India)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground font-sans">
                    API Authorization Bearer Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter API key / Auth token"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  />
                </div>

                {activeProvider === "meta" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground font-sans">
                        Phone Number ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 105658822"
                        value={phoneId}
                        onChange={(e) => setPhoneId(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground font-sans">
                        WhatsApp Business ID
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10986548"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                      />
                    </div>
                  </div>
                )}

                {activeProvider === "twilio" && (
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground font-sans">
                      Twilio Sender Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. whatsapp:+14155238886"
                      value={senderNum}
                      onChange={(e) => setSenderNum(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active_check"
                    checked={isWpActive}
                    onChange={(e) => setIsWpActive(e.target.checked)}
                    className="size-4 border-border rounded text-primary focus:ring-ring"
                  />
                  <label
                    htmlFor="is_active_check"
                    className="text-xs font-semibold text-foreground"
                  >
                    Enable WhatsApp Integrations Gateway
                  </label>
                </div>

                <button
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {savingConfig ? "Saving..." : "Save Credentials"}
                </button>
              </div>
            </div>

            {/* Test Connection sandbox */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans">
                Connection Diagnostic Utility
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Sends a sandbox absent template notification message to verify webhook bindings and
                authorization tokens.
              </p>

              <div className="space-y-3 mt-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground font-sans">
                    Recipient Mobile Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +919876543210"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground"
                  />
                </div>

                <button
                  onClick={handleTestConnection}
                  disabled={testingConnection || !testPhone.trim() || templates.length === 0}
                  className="px-4 py-2 bg-brand text-brand-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5 shadow"
                >
                  <Send className="size-3.5" /> Dispatch Test Message
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

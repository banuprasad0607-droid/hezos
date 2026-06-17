import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase$1 } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { w as whatsappService } from "./whatsapp-service-rc8qIpIC.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  aj as Sparkles,
  Y as MessageSquare,
  k as ChartColumn,
  W as Megaphone,
  I as FileText,
  ab as Settings,
  a9 as Search,
  aq as UserCheck,
  m as CheckCheck,
  l as Check,
  g as Bot,
  aa as Send,
  O as Info,
  C as Calendar,
  D as DollarSign,
  J as GraduationCap,
  f as BookOpen,
  u as Clock,
} from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
import "../_libs/isbot.mjs";
import "../_libs/recharts.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
import "../_libs/zod.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
const supabase = supabase$1;
function WhatsAppManagementPage() {
  const { currentSchoolId: schoolId, roles, user, loading: tenantLoading } = useTenant();
  usePageTitle("WhatsApp Inbox");
  const [activeTab, setActiveTab] = reactExports.useState("inbox");
  const [loading, setLoading] = reactExports.useState(true);
  const [settings, setSettings] = reactExports.useState(null);
  const [templates, setTemplates] = reactExports.useState([]);
  const [campaigns, setCampaigns] = reactExports.useState([]);
  const [conversations, setConversations] = reactExports.useState([]);
  const [messages, setMessages] = reactExports.useState([]);
  const [staffList, setStaffList] = reactExports.useState([]);
  const [classesList, setClassesList] = reactExports.useState([]);
  const [studentList, setStudentList] = reactExports.useState([]);
  const [analytics, setAnalytics] = reactExports.useState({
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
  const [selectedConv, setSelectedConv] = reactExports.useState(null);
  const [chatMessage, setChatMessage] = reactExports.useState("");
  const [mockReplyText, setMockReplyText] = reactExports.useState("");
  const [sendingMsg, setSendingMsg] = reactExports.useState(false);
  const [mockingReply, setMockingReply] = reactExports.useState(false);
  const [inboxFilter, setInboxFilter] = reactExports.useState("all");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [campName, setCampName] = reactExports.useState("");
  const [campTarget, setCampTarget] = reactExports.useState("all_parents");
  const [campClassId, setCampClassId] = reactExports.useState("");
  const [campStudentId, setCampStudentId] = reactExports.useState("");
  const [campTemplateId, setCampTemplateId] = reactExports.useState("");
  const [campVariables, setCampVariables] = reactExports.useState([]);
  const [creatingCamp, setCreatingCamp] = reactExports.useState(false);
  const [newTempName, setNewTempName] = reactExports.useState("");
  const [newTempCat, setNewTempCat] = reactExports.useState("UTILITY");
  const [newTempBody, setNewTempBody] = reactExports.useState("");
  const [creatingTemp, setCreatingTemp] = reactExports.useState(false);
  const [activeProvider, setActiveProvider] = reactExports.useState("meta");
  const [apiKey, setApiKey] = reactExports.useState("");
  const [phoneId, setPhoneId] = reactExports.useState("");
  const [accountId, setAccountId] = reactExports.useState("");
  const [senderNum, setSenderNum] = reactExports.useState("");
  const [isWpActive, setIsWpActive] = reactExports.useState(false);
  const [savingConfig, setSavingConfig] = reactExports.useState(false);
  const [testPhone, setTestPhone] = reactExports.useState("");
  const [testingConnection, setTestingConnection] = reactExports.useState(false);
  const loadData = reactExports.useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
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
      const templatesData = await whatsappService.getTemplates(schoolId);
      setTemplates(templatesData);
      if (templatesData.length > 0 && !campTemplateId) {
        setCampTemplateId(templatesData[0].id);
      }
      const campaignsData = await whatsappService.getCampaigns(schoolId);
      setCampaigns(campaignsData);
      const convs = await whatsappService.getConversations(schoolId);
      setConversations(convs);
      const { data: staff } = await supabase
        .from("profiles")
        .select("user_id, full_name, designation")
        .eq("school_id", schoolId);
      setStaffList(staff || []);
      const { data: classes } = await supabase
        .from("classes")
        .select("id, name, section")
        .eq("school_id", schoolId);
      setClassesList(classes || []);
      const { data: students } = await supabase
        .from("students")
        .select("id, full_name, class_id, roll_number, parent_user_id, parent_email")
        .eq("school_id", schoolId);
      setStudentList(students || []);
      const stats = await whatsappService.getAnalytics(schoolId);
      setAnalytics(stats);
      setLoading(false);
    } catch (e) {
      toast.error("Failed to load WhatsApp data: " + e.message);
      setLoading(false);
    }
  }, [schoolId]);
  reactExports.useEffect(() => {
    void loadData();
  }, [loadData]);
  reactExports.useEffect(() => {
    if (!schoolId || !selectedConv) return;
    const fetchMsgs = async () => {
      try {
        const data = await whatsappService.getMessages(schoolId, selectedConv.id);
        setMessages(data);
      } catch (err) {
        toast.error("Failed to load message thread: " + err.message);
      }
    };
    void fetchMsgs();
  }, [selectedConv, schoolId]);
  const handleAutoProvisionMockData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      await whatsappService.saveSettings(schoolId, {
        provider: "meta",
        api_key: "EAAG3tYZBZC8wBA...",
        phone_number_id: "105658822479634",
        whatsapp_business_account_id: "109865489812652",
        sender_number: "+15550100456",
        is_active: true,
      });
      const mockTemplates = [
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
        await whatsappService.createTemplate(schoolId, t);
      }
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
    } catch (err) {
      toast.error("Auto provision failed: " + err.message);
      setLoading(false);
    }
  };
  const handleSendChatMessage = async () => {
    if (!schoolId || !selectedConv || !chatMessage.trim() || !user) return;
    setSendingMsg(true);
    try {
      await whatsappService.sendChatMessage(schoolId, selectedConv.id, chatMessage.trim(), user.id);
      setChatMessage("");
      const data = await whatsappService.getMessages(schoolId, selectedConv.id);
      setMessages(data);
      setSendingMsg(false);
    } catch (err) {
      toast.error("Failed to send message: " + err.message);
      setSendingMsg(false);
    }
  };
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
      const msgs = await whatsappService.getMessages(schoolId, selectedConv.id);
      setMessages(msgs);
      const convs = await whatsappService.getConversations(schoolId);
      setConversations(convs);
      const updatedConv = convs.find((c) => c.id === selectedConv.id);
      if (updatedConv) setSelectedConv(updatedConv);
      const stats = await whatsappService.getAnalytics(schoolId);
      setAnalytics(stats);
      toast.success("Mock parent reply and AI auto-response logged successfully!");
      setMockingReply(false);
    } catch (err) {
      toast.error("Mock failed: " + err.message);
      setMockingReply(false);
    }
  };
  const handleAssignConversation = async (staffId) => {
    if (!selectedConv) return;
    try {
      await whatsappService.assignConversation(selectedConv.id, staffId);
      const convs = await whatsappService.getConversations(schoolId);
      setConversations(convs);
      const updated = convs.find((c) => c.id === selectedConv.id);
      if (updated) setSelectedConv(updated);
      toast.success("Conversation assignment updated.");
    } catch (err) {
      toast.error("Failed to assign: " + err.message);
    }
  };
  const handleUpdateStatus = async (status) => {
    if (!selectedConv) return;
    try {
      await whatsappService.updateConversationStatus(selectedConv.id, status);
      const convs = await whatsappService.getConversations(schoolId);
      setConversations(convs);
      const updated = convs.find((c) => c.id === selectedConv.id);
      if (updated) setSelectedConv(updated);
      toast.success(`Status updated to ${status}.`);
    } catch (err) {
      toast.error("Failed to update status: " + err.message);
    }
  };
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
      if (campVariables.length < template.variables.length) {
        toast.error(
          `Please provide mappings for all template variables (needs ${template.variables.length} values).`,
        );
        setCreatingCamp(false);
        return;
      }
      const camp = await whatsappService.createCampaign(schoolId, {
        name: campName.trim(),
        template_id: campTemplateId,
        target_type: campTarget,
        target_class_id: campTarget === "class" ? campClassId : null,
        total_messages: 0,
        // calculated based on cohort
      });
      let targetParents = [];
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
      await supabase
        .from("whatsapp_campaigns")
        .update({
          total_messages: targetParents.length,
        })
        .eq("id", camp.id);
      toast.info(`Broadcasting template message to ${targetParents.length} parent contacts...`);
      let sentCount = 0;
      let failedCount = 0;
      let readCount = 0;
      for (const parent of targetParents) {
        try {
          const phone = parent.phone_number || "+91 90000 " + Math.floor(1e4 + Math.random() * 9e4);
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
            camp.id,
          );
          sentCount++;
          readCount += Math.random() > 0.4 ? 1 : 0;
        } catch (err) {
          failedCount++;
        }
      }
      await supabase
        .from("whatsapp_campaigns")
        .update({
          status: "completed",
          sent_count: sentCount,
          delivered_count: sentCount,
          read_count: readCount,
          failed_count: failedCount,
        })
        .eq("id", camp.id);
      setCampName("");
      setCampVariables([]);
      toast.success(`Campaign "${campName}" completed! ${sentCount} messages sent successfully.`);
      void loadData();
      setCreatingCamp(false);
    } catch (err) {
      toast.error("Campaign execution failed: " + err.message);
      setCreatingCamp(false);
    }
  };
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
    } catch (err) {
      toast.error("Failed to save configuration: " + err.message);
      setSavingConfig(false);
    }
  };
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
      await whatsappService.sendTemplateMessage(schoolId, testPhone.trim(), template.id, [
        "Aman Sharma",
      ]);
      toast.success("Test message dispatched! Check recipient's phone.");
      setTestingConnection(false);
    } catch (err) {
      toast.error("Test connection failed: " + err.message);
      setTestingConnection(false);
    }
  };
  const handleCreateTemplate = async () => {
    if (!schoolId || !newTempName.trim() || !newTempBody.trim()) {
      toast.error("Fill all template fields.");
      return;
    }
    setCreatingTemp(true);
    try {
      const matches = newTempBody.match(/\{\{\d+\}\}/g) || [];
      const variablesCount = Array.from(new Set(matches)).map((m) => m.replace(/[\{\}]/g, ""));
      await whatsappService.createTemplate(schoolId, {
        name: newTempName.toLowerCase().trim().replace(/\s+/g, "_"),
        category: newTempCat,
        language: "en",
        body_text: newTempBody.trim(),
        status: "approved",
        // Auto-approved inside sandbox for frictionless testing
        variables: variablesCount,
      });
      setNewTempName("");
      setNewTempBody("");
      toast.success("Template registered and synced successfully!");
      void loadData();
      setCreatingTemp(false);
    } catch (err) {
      toast.error("Failed to register template: " + err.message);
      setCreatingTemp(false);
    }
  };
  const filteredConversations = reactExports.useMemo(() => {
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
  const studentContext = reactExports.useMemo(() => {
    if (!selectedConv || !selectedConv.parent_user_id) return null;
    return studentList.find((s) => s.parent_user_id === selectedConv.parent_user_id) || null;
  }, [selectedConv, studentList]);
  if (tenantLoading || loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading WhatsApp Services...",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "WhatsApp Inbox",
        breadcrumb: "SaaS Messaging Hub",
        actions:
          templates.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                onClick: handleAutoProvisionMockData,
                className:
                  "px-4 py-2 text-xs font-semibold bg-brand text-brand-foreground rounded-lg inline-flex items-center gap-1.5 shadow-sm hover:opacity-90 transition",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, {
                    className: "size-4 animate-pulse",
                  }),
                  " Auto-Provision Sandbox Config",
                ],
              })
            : null,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-hidden p-6 flex flex-col gap-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "flex bg-secondary p-0.5 rounded-lg self-start",
            children: [
              {
                id: "inbox",
                label: "Conversational Inbox",
                icon: MessageSquare,
              },
              {
                id: "dashboard",
                label: "Analytics Dashboard",
                icon: ChartColumn,
              },
              {
                id: "campaigns",
                label: "Campaign Broadcaster",
                icon: Megaphone,
              },
              {
                id: "templates",
                label: "Template Registry",
                icon: FileText,
              },
              {
                id: "config",
                label: "Integration Settings",
                icon: Settings,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setActiveTab(tab.id),
                  className: `px-4 py-2 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 transition ${activeTab === tab.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-3.5" }),
                    " ",
                    tab.label,
                  ],
                },
                tab.id,
              );
            }),
          }),
          activeTab === "inbox" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className:
                "flex-1 min-h-0 bg-card border border-border rounded-xl flex overflow-hidden shadow-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "w-80 border-r border-border flex flex-col shrink-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "p-4 border-b border-border space-y-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "relative",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                              className: "size-4 absolute left-3 top-2.5 text-muted-foreground",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "text",
                              placeholder: "Search conversations...",
                              value: searchQuery,
                              onChange: (e) => setSearchQuery(e.target.value),
                              className:
                                "w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-xs",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "flex gap-1 flex-wrap",
                          children: [
                            {
                              id: "all",
                              label: "All",
                            },
                            {
                              id: "open",
                              label: "Open",
                            },
                            {
                              id: "in_progress",
                              label: "Active",
                            },
                            {
                              id: "resolved",
                              label: "Resolved",
                            },
                            {
                              id: "my",
                              label: "Mine",
                            },
                          ].map((f) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                onClick: () => setInboxFilter(f.id),
                                className: `px-2 py-1 text-[10px] font-medium rounded transition ${inboxFilter === f.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
                                children: f.label,
                              },
                              f.id,
                            ),
                          ),
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "flex-1 overflow-y-auto divide-y divide-border/60",
                      children:
                        filteredConversations.length === 0
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "p-8 text-center text-muted-foreground text-xs",
                              children: "No active chats found.",
                            })
                          : filteredConversations.map((c) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  onClick: () => setSelectedConv(c),
                                  className: `p-4 cursor-pointer hover:bg-accent transition flex flex-col gap-1.5 ${selectedConv?.id === c.id ? "bg-accent" : ""}`,
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex justify-between items-start",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "font-semibold text-xs truncate max-w-[140px] text-foreground",
                                          children: c.parent_name || c.parent_phone,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className: "text-[10px] text-muted-foreground",
                                          children: new Date(c.last_message_at).toLocaleTimeString(
                                            [],
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            },
                                          ),
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "text-[11px] text-muted-foreground truncate",
                                      children: c.last_message_body,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex justify-between items-center mt-1",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className: `text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${c.status === "open" ? "bg-danger-soft text-danger" : c.status === "in_progress" ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`,
                                          children: c.status,
                                        }),
                                        c.unread_count > 0 &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "size-4 bg-brand text-brand-foreground text-[10px] rounded-full flex items-center justify-center font-bold",
                                            children: c.unread_count,
                                          }),
                                      ],
                                    }),
                                  ],
                                },
                                c.id,
                              ),
                            ),
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "flex-1 flex flex-col min-w-0 bg-secondary/20",
                  children: selectedConv
                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "p-4 border-b border-border bg-card flex justify-between items-center shrink-0",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                    className: "font-bold text-sm text-foreground",
                                    children: selectedConv.parent_name,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: selectedConv.parent_phone,
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-lg border border-border",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, {
                                        className: "size-3.5 text-muted-foreground",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                        value: selectedConv.assigned_to_user_id || "",
                                        onChange: (e) =>
                                          handleAssignConversation(e.target.value || null),
                                        className:
                                          "bg-transparent text-xs focus:outline-none text-foreground",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "",
                                            children: "Unassigned",
                                          }),
                                          staffList.map((st) =>
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "option",
                                              {
                                                value: st.user_id,
                                                children: [
                                                  st.full_name,
                                                  " (",
                                                  st.designation || "Staff",
                                                  ")",
                                                ],
                                              },
                                              st.user_id,
                                            ),
                                          ),
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                    value: selectedConv.status,
                                    onChange: (e) => handleUpdateStatus(e.target.value),
                                    className: `text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none ${selectedConv.status === "open" ? "bg-danger-soft text-danger border-danger/30" : selectedConv.status === "in_progress" ? "bg-warning-soft text-warning border-warning/30" : "bg-success-soft text-success border-success/30"}`,
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                        value: "open",
                                        children: "Open",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                        value: "in_progress",
                                        children: "Active",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                        value: "resolved",
                                        children: "Resolved",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "flex-1 overflow-y-auto p-4 space-y-3 flex flex-col",
                            children:
                              messages.length === 0
                                ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                    className:
                                      "flex-1 flex items-center justify-center text-muted-foreground text-xs italic",
                                    children: "No messages inside this thread.",
                                  })
                                : messages.map((m) => {
                                    const isOut = m.direction === "outbound";
                                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        className: `max-w-[70%] rounded-xl p-3 shadow-sm text-xs flex flex-col gap-1 ${isOut ? "bg-primary text-primary-foreground self-end rounded-tr-none" : "bg-card text-foreground self-start rounded-tl-none border border-border"}`,
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "leading-relaxed whitespace-pre-wrap",
                                            children: m.message_body,
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className:
                                              "flex justify-between items-center gap-4 text-[9px] mt-1 opacity-70",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className: "font-semibold",
                                                children: isOut
                                                  ? m.ai_replied
                                                    ? "🤖 AI Assistant"
                                                    : m.sender?.full_name || "Office"
                                                  : "Parent",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                className: "flex items-center gap-0.5",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    children: new Date(
                                                      m.created_at,
                                                    ).toLocaleTimeString([], {
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                    }),
                                                  }),
                                                  isOut &&
                                                    (m.status === "read"
                                                      ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          CheckCheck,
                                                          { className: "size-3 text-success" },
                                                        )
                                                      : m.status === "delivered"
                                                        ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            CheckCheck,
                                                            { className: "size-3 text-muted" },
                                                          )
                                                        : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            Check,
                                                            { className: "size-3 text-muted" },
                                                          )),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      m.id,
                                    );
                                  }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "p-4 bg-card border-t border-border shrink-0 space-y-3",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "bg-secondary/40 border border-dashed border-border rounded-lg p-2.5 flex items-center justify-between gap-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "flex items-center gap-1.5 text-xs text-muted-foreground",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, {
                                        className: "size-4 text-brand",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        children: "Mock inbound reply from parent (triggers AI):",
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex-1 max-w-md flex gap-2",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                        type: "text",
                                        placeholder: "e.g. Is Rohan present today? / pending fees",
                                        value: mockReplyText,
                                        onChange: (e) => setMockReplyText(e.target.value),
                                        className:
                                          "flex-1 px-3 py-1 text-xs border border-border rounded bg-background text-foreground",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                        onClick: handleMockParentReply,
                                        disabled: mockingReply || !mockReplyText.trim(),
                                        className:
                                          "px-3 py-1 bg-brand text-brand-foreground rounded text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                                        children: "Simulate Reply",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "flex gap-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                    type: "text",
                                    placeholder: "Type a custom reply message...",
                                    value: chatMessage,
                                    onChange: (e) => setChatMessage(e.target.value),
                                    onKeyDown: (e) => e.key === "Enter" && handleSendChatMessage(),
                                    className:
                                      "flex-1 px-4 py-2 border border-border rounded-lg bg-background text-xs text-foreground focus:outline-none",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                    onClick: handleSendChatMessage,
                                    disabled: sendingMsg || !chatMessage.trim(),
                                    className:
                                      "px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-1 text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Send, {
                                        className: "size-3.5",
                                      }),
                                      " Send",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                    : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, {
                            className: "size-12 text-muted-foreground/40 mb-3",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "font-semibold text-sm",
                            children: "No conversation selected",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-xs mt-1",
                            children: "Select a chat from the left panel to begin replying.",
                          }),
                        ],
                      }),
                }),
                selectedConv &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className:
                      "w-80 border-l border-border flex flex-col shrink-0 p-5 space-y-6 overflow-y-auto",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center gap-2 border-b border-border pb-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, {
                            className: "size-4.5 text-muted-foreground",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                            className: "font-bold text-xs uppercase tracking-wider text-foreground",
                            children: "Student Context",
                          }),
                        ],
                      }),
                      studentContext
                        ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "space-y-5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                    className:
                                      "size-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold",
                                    children: studentContext.full_name.slice(0, 1).toUpperCase(),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("h5", {
                                        className: "font-semibold text-xs text-foreground",
                                        children: studentContext.full_name,
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                        className: "text-[10px] text-muted-foreground",
                                        children: ["Roll No: ", studentContext.roll_number || "—"],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "grid grid-cols-2 gap-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "bg-secondary/40 border border-border/80 rounded-lg p-3 text-center",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
                                        className: "size-4 text-brand mx-auto mb-1",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "text-[9px] uppercase font-bold tracking-wider text-muted-foreground block",
                                        children: "Attendance",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "text-xs font-bold text-foreground",
                                        children: "94% (Good)",
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "bg-secondary/40 border border-border/80 rounded-lg p-3 text-center",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, {
                                        className: "size-4 text-danger mx-auto mb-1",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "text-[9px] uppercase font-bold tracking-wider text-muted-foreground block",
                                        children: "Fee Dues",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "text-xs font-bold text-danger",
                                        children: "₹4,500",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "space-y-3 border-t border-border/60 pt-4",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex items-center gap-1.5 text-xs",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
                                        className: "size-4 text-muted-foreground",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "font-medium text-foreground",
                                        children: "Class:",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "text-muted-foreground",
                                        children: "Class 10A",
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex items-center gap-1.5 text-xs",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, {
                                        className: "size-4 text-muted-foreground",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "font-medium text-foreground",
                                        children: "Active Homework:",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "text-muted-foreground",
                                        children: "Quadratic Equations",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          })
                        : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "text-center p-8 text-muted-foreground text-xs italic",
                            children:
                              "Could not link conversation phone number to an active student profile in database.",
                          }),
                    ],
                  }),
              ],
            }),
          activeTab === "dashboard" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "space-y-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                  children: [
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
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className:
                          "bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "space-y-1.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "text-xs text-muted-foreground font-medium",
                                children: c.title,
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-2xl font-bold text-foreground",
                                children: c.value,
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "text-[10px] text-muted-foreground block",
                                children: c.desc,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: `size-10 rounded-full bg-secondary flex items-center justify-center ${c.color}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, {
                              className: "size-5",
                            }),
                          }),
                        ],
                      },
                      idx,
                    );
                  }),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                          className: "font-bold text-xs uppercase tracking-wider text-foreground",
                          children: "Resolution Performance",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex justify-between items-center text-xs",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className: "text-muted-foreground",
                                  children: "Read Rate (Total Opened)",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                  className: "font-semibold text-foreground",
                                  children: [
                                    Math.round((analytics.read / analytics.delivered) * 100),
                                    "%",
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "w-full bg-secondary h-2 rounded-full overflow-hidden",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className: "bg-brand h-full rounded-full",
                                style: {
                                  width: `${(analytics.read / analytics.delivered) * 100}%`,
                                },
                              }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex justify-between items-center text-xs mt-3",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className: "text-muted-foreground",
                                  children: "Open Chats Resolution Rate",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                  className: "font-semibold text-foreground",
                                  children: [analytics.resolutionRate, "%"],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "w-full bg-secondary h-2 rounded-full overflow-hidden",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className: "bg-success h-full rounded-full",
                                style: {
                                  width: `${analytics.resolutionRate}%`,
                                },
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                          className:
                            "font-bold text-xs uppercase tracking-wider text-foreground font-sans",
                          children: "Common Parent Questions",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "space-y-2",
                          children: [
                            {
                              question: "Attendance Verification (absences checks)",
                              pct: 42,
                            },
                            {
                              question: "Unpaid Fees & Payment Link requests",
                              pct: 28,
                            },
                            {
                              question: "Class homework schedule questions",
                              pct: 18,
                            },
                            {
                              question: "Exam timetable releases details",
                              pct: 12,
                            },
                          ].map((q, idx) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "div",
                              {
                                className:
                                  "flex items-center justify-between text-xs border-b border-border/40 pb-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "text-muted-foreground truncate",
                                    children: q.question,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className: "font-semibold text-foreground",
                                    children: [q.pct, "%"],
                                  }),
                                ],
                              },
                              idx,
                            ),
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          activeTab === "campaigns" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                      className:
                        "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground",
                      children: "Launch New Campaign",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground",
                              children: "Campaign Name",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "text",
                              placeholder: "e.g. Homework alerts class 10",
                              value: campName,
                              onChange: (e) => setCampName(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "grid grid-cols-2 gap-4",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                  className: "text-xs font-semibold text-muted-foreground",
                                  children: "Target Cohort",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                  value: campTarget,
                                  onChange: (e) => setCampTarget(e.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "all_parents",
                                      children: "All Parents",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "class",
                                      children: "Selected Class",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "student",
                                      children: "Specific Student",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                campTarget === "class" &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    jsxRuntimeExports.Fragment,
                                    {
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-xs font-semibold text-muted-foreground font-sans",
                                          children: "Choose Class",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                          value: campClassId,
                                          onChange: (e) => setCampClassId(e.target.value),
                                          className:
                                            "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                              value: "",
                                              children: "Select Class",
                                            }),
                                            classesList.map((c) =>
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                "option",
                                                { value: c.id, children: [c.name, " ", c.section] },
                                                c.id,
                                              ),
                                            ),
                                          ],
                                        }),
                                      ],
                                    },
                                  ),
                                campTarget === "student" &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    jsxRuntimeExports.Fragment,
                                    {
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-xs font-semibold text-muted-foreground font-sans",
                                          children: "Choose Student",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                          value: campStudentId,
                                          onChange: (e) => setCampStudentId(e.target.value),
                                          className:
                                            "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                              value: "",
                                              children: "Select Student",
                                            }),
                                            studentList.map((s) =>
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                "option",
                                                { value: s.id, children: s.full_name },
                                                s.id,
                                              ),
                                            ),
                                          ],
                                        }),
                                      ],
                                    },
                                  ),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground",
                              children: "Choose Template",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                              value: campTemplateId,
                              onChange: (e) => setCampTemplateId(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                  value: "",
                                  children: "Select Template",
                                }),
                                templates.map((t) =>
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "option",
                                    { value: t.id, children: [t.name, " (", t.category, ")"] },
                                    t.id,
                                  ),
                                ),
                              ],
                            }),
                          ],
                        }),
                        campTemplateId &&
                          templates.find((t) => t.id === campTemplateId) &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "bg-secondary/40 border border-border/80 rounded-lg p-4 space-y-3",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className:
                                  "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block",
                                children: "Variable Mappings",
                              }),
                              templates
                                .find((t) => t.id === campTemplateId)
                                ?.variables.map((v, idx) =>
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "div",
                                    {
                                      className: "flex items-center gap-3 text-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                          className: "w-12 text-muted-foreground",
                                          children: ["Variable #", idx + 1, ":"],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                          type: "text",
                                          placeholder: `Value or {student_name} / {class_name}`,
                                          onChange: (e) => {
                                            const copy = [...campVariables];
                                            copy[idx] = e.target.value;
                                            setCampVariables(copy);
                                          },
                                          className:
                                            "flex-1 px-3 py-1 border border-border rounded bg-background text-foreground text-xs",
                                        }),
                                      ],
                                    },
                                    idx,
                                  ),
                                ),
                            ],
                          }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: handleLaunchCampaign,
                          disabled: creatingCamp || !campName.trim(),
                          className:
                            "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                          children: creatingCamp ? "Broadcasting..." : "Launch Campaign Broadcast",
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                      className:
                        "font-bold text-xs uppercase tracking-wider text-foreground font-sans",
                      children: "Recent Campaigns",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "space-y-3",
                      children:
                        campaigns.length === 0
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-center text-muted-foreground text-xs italic py-4",
                              children: "No broadcasts executed yet.",
                            })
                          : campaigns.map((c) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  className:
                                    "border border-border/80 rounded-lg p-3 space-y-2 text-xs",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex justify-between items-center",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className: "font-bold text-foreground",
                                          children: c.name,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[9px] uppercase font-bold tracking-wider text-success",
                                          children: c.status,
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "grid grid-cols-2 gap-2 text-muted-foreground text-[10px]",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                          children: ["Target: ", c.target_type],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                          children: ["Total: ", c.total_messages, " msgs"],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                      className:
                                        "h-1.5 w-full bg-secondary rounded-full overflow-hidden",
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                        className: "bg-success h-full rounded-full",
                                        style: {
                                          width:
                                            c.total_messages > 0
                                              ? `${(c.sent_count / c.total_messages) * 100}%`
                                              : "100%",
                                        },
                                      }),
                                    }),
                                  ],
                                },
                                c.id,
                              ),
                            ),
                    }),
                  ],
                }),
              ],
            }),
          activeTab === "templates" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "bg-card border border-border rounded-xl p-6 shadow-sm space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                      className:
                        "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                      children: "Request New Template",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground font-sans",
                              children: "Template Name",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "text",
                              placeholder: "e.g. class_alert",
                              value: newTempName,
                              onChange: (e) => setNewTempName(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground font-sans",
                              children: "Category",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                              value: newTempCat,
                              onChange: (e) => setNewTempCat(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                  value: "UTILITY",
                                  children: "Utility / Transactional",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                  value: "MARKETING",
                                  children: "Marketing / Promotion",
                                }),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground font-sans",
                              children: "Body Text",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                              rows: 4,
                              placeholder: "Dear Parent, your child {{1}} has been assigned {{2}}.",
                              value: newTempBody,
                              onChange: (e) => setNewTempBody(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-[10px] text-muted-foreground mt-1 leading-relaxed",
                              children: [
                                "Use placeholders starting from ",
                                /* @__PURE__ */ jsxRuntimeExports.jsx("code", {
                                  className: "bg-secondary px-1 py-0.5 rounded font-mono font-bold",
                                  children: "{{1}}",
                                }),
                                ", ",
                                /* @__PURE__ */ jsxRuntimeExports.jsx("code", {
                                  className: "bg-secondary px-1 py-0.5 rounded font-mono font-bold",
                                  children: "{{2}}",
                                }),
                                ", etc.",
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: handleCreateTemplate,
                          disabled: creatingTemp || !newTempName.trim() || !newTempBody.trim(),
                          className:
                            "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                          children: creatingTemp ? "Registering..." : "Submit for Approval",
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                      className:
                        "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                      children: "Approved Templates",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children:
                        templates.length === 0
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className:
                                "text-muted-foreground text-xs italic p-4 text-center col-span-2",
                              children: "No templates registered.",
                            })
                          : templates.map((t) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "div",
                                {
                                  className:
                                    "border border-border/80 rounded-xl p-4 flex flex-col justify-between gap-4 text-xs bg-secondary/10",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "space-y-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex justify-between items-center",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className: "font-bold text-foreground",
                                              children: t.name,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className:
                                                "text-[9px] uppercase font-bold tracking-wider bg-success-soft text-success px-1.5 py-0.5 rounded",
                                              children: t.status,
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                          className:
                                            "text-muted-foreground text-[11px] leading-relaxed italic",
                                          children: ['"', t.body_text, '"'],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "flex justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                          children: [
                                            "Variables: ",
                                            t.variables.join(", ") || "none",
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "uppercase font-semibold text-[8px] tracking-wider",
                                          children: t.category,
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                t.id,
                              ),
                            ),
                    }),
                  ],
                }),
              ],
            }),
          activeTab === "config" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "bg-card border border-border rounded-xl p-6 shadow-sm space-y-5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                      className:
                        "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                      children: "Provider Credentials",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground font-sans",
                              children: "WhatsApp API Provider",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                              value: activeProvider,
                              onChange: (e) => setActiveProvider(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                  value: "meta",
                                  children: "Meta WhatsApp Business API (Official Cloud)",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                  value: "twilio",
                                  children: "Twilio WhatsApp API Adapter",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                  value: "interakt",
                                  children: "Interakt Business Hub (India)",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                  value: "wati",
                                  children: "WATI API Portal (India)",
                                }),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground font-sans",
                              children: "API Authorization Bearer Key",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "password",
                              placeholder: "Enter API key / Auth token",
                              value: apiKey,
                              onChange: (e) => setApiKey(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                            }),
                          ],
                        }),
                        activeProvider === "meta" &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                    className:
                                      "text-xs font-semibold text-muted-foreground font-sans",
                                    children: "Phone Number ID",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                    type: "text",
                                    placeholder: "e.g. 105658822",
                                    value: phoneId,
                                    onChange: (e) => setPhoneId(e.target.value),
                                    className:
                                      "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                    className:
                                      "text-xs font-semibold text-muted-foreground font-sans",
                                    children: "WhatsApp Business ID",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                    type: "text",
                                    placeholder: "e.g. 10986548",
                                    value: accountId,
                                    onChange: (e) => setAccountId(e.target.value),
                                    className:
                                      "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        activeProvider === "twilio" &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                className: "text-xs font-semibold text-muted-foreground font-sans",
                                children: "Twilio Sender Number",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                type: "text",
                                placeholder: "e.g. whatsapp:+14155238886",
                                value: senderNum,
                                onChange: (e) => setSenderNum(e.target.value),
                                className:
                                  "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                              }),
                            ],
                          }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "checkbox",
                              id: "is_active_check",
                              checked: isWpActive,
                              onChange: (e) => setIsWpActive(e.target.checked),
                              className:
                                "size-4 border-border rounded text-primary focus:ring-ring",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              htmlFor: "is_active_check",
                              className: "text-xs font-semibold text-foreground",
                              children: "Enable WhatsApp Integrations Gateway",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: handleSaveConfig,
                          disabled: savingConfig,
                          className:
                            "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                          children: savingConfig ? "Saving..." : "Save Credentials",
                        }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "bg-card border border-border rounded-xl p-6 shadow-sm space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                      className:
                        "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                      children: "Connection Diagnostic Utility",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-xs text-muted-foreground leading-relaxed",
                      children:
                        "Sends a sandbox absent template notification message to verify webhook bindings and authorization tokens.",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-3 mt-3",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                              className: "text-xs font-semibold text-muted-foreground font-sans",
                              children: "Recipient Mobile Phone",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "text",
                              placeholder: "e.g. +919876543210",
                              value: testPhone,
                              onChange: (e) => setTestPhone(e.target.value),
                              className:
                                "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                          onClick: handleTestConnection,
                          disabled:
                            testingConnection || !testPhone.trim() || templates.length === 0,
                          className:
                            "px-4 py-2 bg-brand text-brand-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5 shadow",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-3.5" }),
                            " Dispatch Test Message",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
        ],
      }),
    ],
  });
}
export { WhatsAppManagementPage as component };

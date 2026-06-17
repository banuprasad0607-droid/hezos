export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      announcements: {
        Row: {
          body: string;
          class_id: string | null;
          created_at: string;
          created_by: string;
          id: string;
          school_id: string;
          title: string;
        };
        Insert: {
          body: string;
          class_id?: string | null;
          created_at?: string;
          created_by: string;
          id?: string;
          school_id: string;
          title: string;
        };
        Update: {
          body?: string;
          class_id?: string | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          school_id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "announcements_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "announcements_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      attendance: {
        Row: {
          class_id: string;
          created_at: string;
          date: string;
          id: string;
          marked_by: string;
          school_id: string;
          status: Database["public"]["Enums"]["attendance_status"];
          student_id: string;
          updated_at: string;
        };
        Insert: {
          class_id: string;
          created_at?: string;
          date?: string;
          id?: string;
          marked_by: string;
          school_id: string;
          status: Database["public"]["Enums"]["attendance_status"];
          student_id: string;
          updated_at?: string;
        };
        Update: {
          class_id?: string;
          created_at?: string;
          date?: string;
          id?: string;
          marked_by?: string;
          school_id?: string;
          status?: Database["public"]["Enums"]["attendance_status"];
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attendance_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      classes: {
        Row: {
          created_at: string;
          grade: string | null;
          id: string;
          name: string;
          school_id: string;
          section: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          grade?: string | null;
          id?: string;
          name: string;
          school_id: string;
          section?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          grade?: string | null;
          id?: string;
          name?: string;
          school_id?: string;
          section?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "classes_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      fee_invoices: {
        Row: {
          amount_due: number;
          amount_paid: number;
          created_at: string;
          due_date: string | null;
          fee_structure_id: string | null;
          id: string;
          period: string;
          school_id: string;
          status: string;
          student_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          amount_due: number;
          amount_paid?: number;
          created_at?: string;
          due_date?: string | null;
          fee_structure_id?: string | null;
          id?: string;
          period: string;
          school_id: string;
          status?: string;
          student_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          amount_due?: number;
          amount_paid?: number;
          created_at?: string;
          due_date?: string | null;
          fee_structure_id?: string | null;
          id?: string;
          period?: string;
          school_id?: string;
          status?: string;
          student_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fee_invoices_fee_structure_id_fkey";
            columns: ["fee_structure_id"];
            isOneToOne: false;
            referencedRelation: "fee_structures";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fee_invoices_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fee_invoices_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      fee_payments: {
        Row: {
          amount: number;
          collected_by: string;
          created_at: string;
          id: string;
          invoice_id: string;
          method: string;
          paid_on: string;
          reference: string | null;
          school_id: string;
        };
        Insert: {
          amount: number;
          collected_by: string;
          created_at?: string;
          id?: string;
          invoice_id: string;
          method?: string;
          paid_on?: string;
          reference?: string | null;
          school_id: string;
        };
        Update: {
          amount?: number;
          collected_by?: string;
          created_at?: string;
          id?: string;
          invoice_id?: string;
          method?: string;
          paid_on?: string;
          reference?: string | null;
          school_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fee_payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "fee_invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fee_payments_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      fee_structures: {
        Row: {
          amount: number;
          category: string;
          class_id: string | null;
          created_at: string;
          frequency: string;
          id: string;
          name: string;
          school_id: string;
        };
        Insert: {
          amount: number;
          category?: string;
          class_id?: string | null;
          created_at?: string;
          frequency?: string;
          id?: string;
          name: string;
          school_id: string;
        };
        Update: {
          amount?: number;
          category?: string;
          class_id?: string | null;
          created_at?: string;
          frequency?: string;
          id?: string;
          name?: string;
          school_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fee_structures_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fee_structures_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      homework: {
        Row: {
          class_id: string;
          created_at: string;
          description: string | null;
          due_date: string | null;
          file_type: Database["public"]["Enums"]["homework_file_type"];
          file_url: string | null;
          id: string;
          school_id: string;
          subject: string | null;
          teacher_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          class_id: string;
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          file_type?: Database["public"]["Enums"]["homework_file_type"];
          file_url?: string | null;
          id?: string;
          school_id: string;
          subject?: string | null;
          teacher_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          class_id?: string;
          created_at?: string;
          description?: string | null;
          due_date?: string | null;
          file_type?: Database["public"]["Enums"]["homework_file_type"];
          file_url?: string | null;
          id?: string;
          school_id?: string;
          subject?: string | null;
          teacher_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "homework_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "homework_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      leave_requests: {
        Row: {
          created_at: string;
          end_date: string;
          id: string;
          parent_user_id: string;
          reason: string;
          review_note: string | null;
          reviewed_at: string | null;
          reviewed_by: string | null;
          school_id: string;
          start_date: string;
          status: string;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          end_date: string;
          id?: string;
          parent_user_id: string;
          reason: string;
          review_note?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          school_id: string;
          start_date: string;
          status?: string;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          end_date?: string;
          id?: string;
          parent_user_id?: string;
          reason?: string;
          review_note?: string | null;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
          school_id?: string;
          start_date?: string;
          status?: string;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          link: string | null;
          read_at: string | null;
          school_id: string;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          school_id: string;
          title: string;
          type?: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          link?: string | null;
          read_at?: string | null;
          school_id?: string;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      platform_invoices: {
        Row: {
          amount: number;
          created_at: string;
          due_date: string | null;
          gst_amount: number;
          id: string;
          invoice_number: string;
          school_id: string;
          status: string;
          total_amount: number;
          updated_at: string;
          billing_period_start: string | null;
          billing_period_end: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          due_date?: string | null;
          gst_amount?: number;
          id?: string;
          invoice_number: string;
          school_id: string;
          status?: string;
          total_amount: number;
          updated_at?: string;
          billing_period_start?: string | null;
          billing_period_end?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          due_date?: string | null;
          gst_amount?: number;
          id?: string;
          invoice_number?: string;
          school_id?: string;
          status?: string;
          total_amount?: number;
          updated_at?: string;
          billing_period_start?: string | null;
          billing_period_end?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "platform_invoices_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      platform_payments: {
        Row: {
          amount: number;
          created_at: string;
          id: string;
          invoice_id: string;
          payment_method: string | null;
          reference: string | null;
          school_id: string;
          status: string;
          paid_at: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: string;
          invoice_id: string;
          payment_method?: string | null;
          reference?: string | null;
          school_id: string;
          status?: string;
          paid_at?: string;
        };
        Update: {
          amount?: number;
          created_at?: string;
          due_date?: string | null;
          invoice_id?: string;
          payment_method?: string | null;
          reference?: string | null;
          school_id?: string;
          status?: string;
          paid_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "platform_payments_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "platform_invoices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "platform_payments_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      payroll_items: {
        Row: {
          allowances: number;
          base_salary: number;
          created_at: string;
          deductions: number;
          id: string;
          net_amount: number;
          paid_on: string | null;
          payment_method: string | null;
          payroll_run_id: string;
          reference: string | null;
          school_id: string;
          status: string;
          teacher_id: string;
        };
        Insert: {
          allowances?: number;
          base_salary?: number;
          created_at?: string;
          deductions?: number;
          id?: string;
          net_amount?: number;
          paid_on?: string | null;
          payment_method?: string | null;
          payroll_run_id: string;
          reference?: string | null;
          school_id: string;
          status?: string;
          teacher_id: string;
        };
        Update: {
          allowances?: number;
          base_salary?: number;
          created_at?: string;
          deductions?: number;
          id?: string;
          net_amount?: number;
          paid_on?: string | null;
          payment_method?: string | null;
          payroll_run_id?: string;
          reference?: string | null;
          school_id?: string;
          status?: string;
          teacher_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payroll_items_payroll_run_id_fkey";
            columns: ["payroll_run_id"];
            isOneToOne: false;
            referencedRelation: "payroll_runs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payroll_items_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      payroll_runs: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          period: string;
          processed_at: string | null;
          school_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          period: string;
          processed_at?: string | null;
          school_id: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          period?: string;
          processed_at?: string | null;
          school_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payroll_runs_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          school_id: string | null;
          updated_at: string;
          user_id: string;
          photo_url: string | null;
          employee_id: string | null;
          designation: string | null;
          department: string | null;
          joining_date: string | null;
          mobile_number: string | null;
          blood_group: string | null;
          address: string | null;
          emergency_contact: string | null;
          notes: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          school_id?: string | null;
          updated_at?: string;
          user_id: string;
          photo_url?: string | null;
          employee_id?: string | null;
          designation?: string | null;
          department?: string | null;
          joining_date?: string | null;
          mobile_number?: string | null;
          blood_group?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
          notes?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          school_id?: string | null;
          updated_at?: string;
          user_id?: string;
          photo_url?: string | null;
          employee_id?: string | null;
          designation?: string | null;
          department?: string | null;
          joining_date?: string | null;
          mobile_number?: string | null;
          blood_group?: string | null;
          address?: string | null;
          emergency_contact?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      remarks: {
        Row: {
          category: Database["public"]["Enums"]["remark_category"];
          content: string;
          created_at: string;
          id: string;
          school_id: string;
          student_id: string;
          teacher_id: string;
          visible_to_parent: boolean;
        };
        Insert: {
          category: Database["public"]["Enums"]["remark_category"];
          content: string;
          created_at?: string;
          id?: string;
          school_id: string;
          student_id: string;
          teacher_id: string;
          visible_to_parent?: boolean;
        };
        Update: {
          category?: Database["public"]["Enums"]["remark_category"];
          content?: string;
          created_at?: string;
          id?: string;
          school_id?: string;
          student_id?: string;
          teacher_id?: string;
          visible_to_parent?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "remarks_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "remarks_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      school_credentials: {
        Row: {
          created_at: string;
          id: string;
          school_id: string;
          temp_password: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          school_id: string;
          temp_password?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          school_id?: string;
          temp_password?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      schools: {
        Row: {
          address: string | null;
          code: string | null;
          created_at: string;
          email: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          owner_id: string;
          phone: string | null;
          phone_number: string | null;
          plan: string;
          status: string;
          student_limit: number;
          teacher_limit: number;
          updated_at: string;
          school_name: string;
          school_code: string | null;
          school_logo: string | null;
          admin_id: string;
        };
        Insert: {
          address?: string | null;
          code?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          owner_id: string;
          phone?: string | null;
          phone_number?: string | null;
          plan?: string;
          status?: string;
          student_limit?: number;
          teacher_limit?: number;
          updated_at?: string;
          school_name?: string;
          school_code?: string | null;
          school_logo?: string | null;
          admin_id?: string;
        };
        Update: {
          address?: string | null;
          code?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          owner_id?: string;
          phone?: string | null;
          phone_number?: string | null;
          plan?: string;
          status?: string;
          student_limit?: number;
          teacher_limit?: number;
          updated_at?: string;
          school_name?: string;
          school_code?: string | null;
          school_logo?: string | null;
          admin_id?: string;
        };
        Relationships: [];
      };
      students: {
        Row: {
          address: string | null;
          admission_number: string | null;
          class_id: string | null;
          created_at: string;
          date_of_birth: string | null;
          full_name: string;
          gender: string | null;
          id: string;
          parent_email: string | null;
          parent_name: string | null;
          parent_phone: string | null;
          parent_user_id: string | null;
          photo_url: string | null;
          roll_number: string | null;
          school_id: string;
          updated_at: string;
          blood_group: string | null;
          emergency_contact: string | null;
          transport_route: string | null;
          bus_number: string | null;
          academic_year: string | null;
        };
        Insert: {
          address?: string | null;
          admission_number?: string | null;
          class_id?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          full_name: string;
          gender?: string | null;
          id?: string;
          parent_email?: string | null;
          parent_name?: string | null;
          parent_phone?: string | null;
          parent_user_id?: string | null;
          photo_url?: string | null;
          roll_number?: string | null;
          school_id: string;
          updated_at?: string;
          blood_group?: string | null;
          emergency_contact?: string | null;
          transport_route?: string | null;
          bus_number?: string | null;
          academic_year?: string | null;
        };
        Update: {
          address?: string | null;
          admission_number?: string | null;
          class_id?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          full_name?: string;
          gender?: string | null;
          id?: string;
          parent_email?: string | null;
          parent_name?: string | null;
          parent_phone?: string | null;
          parent_user_id?: string | null;
          photo_url?: string | null;
          roll_number?: string | null;
          school_id?: string;
          updated_at?: string;
          blood_group?: string | null;
          emergency_contact?: string | null;
          transport_route?: string | null;
          bus_number?: string | null;
          academic_year?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "students_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      subjects: {
        Row: {
          code: string | null;
          created_at: string;
          id: string;
          name: string;
          school_id: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string;
          id?: string;
          name: string;
          school_id: string;
        };
        Update: {
          code?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          school_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subjects_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      subscriptions: {
        Row: {
          created_at: string;
          current_period_end: string | null;
          id: string;
          monthly_amount: number;
          plan: string;
          school_id: string;
          status: string;
          updated_at: string;
          billing_cycle: string;
          trial_end: string | null;
        };
        Insert: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          monthly_amount?: number;
          plan?: string;
          school_id: string;
          status?: string;
          updated_at?: string;
          billing_cycle?: string;
          trial_end?: string | null;
        };
        Update: {
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          monthly_amount?: number;
          plan?: string;
          school_id?: string;
          status?: string;
          updated_at?: string;
          billing_cycle?: string;
          trial_end?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subscriptions_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      teacher_invitations: {
        Row: {
          accepted_at: string | null;
          accepted_by: string | null;
          created_at: string;
          email: string;
          expires_at: string;
          full_name: string | null;
          id: string;
          invited_by: string;
          revoked_at: string | null;
          school_id: string;
          temp_password: string | null;
          token: string;
        };
        Insert: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          email: string;
          expires_at?: string;
          full_name?: string | null;
          id?: string;
          invited_by: string;
          revoked_at?: string | null;
          school_id: string;
          temp_password?: string | null;
          token?: string;
        };
        Update: {
          accepted_at?: string | null;
          accepted_by?: string | null;
          created_at?: string;
          email?: string;
          expires_at?: string;
          full_name?: string | null;
          id?: string;
          invited_by?: string;
          revoked_at?: string | null;
          school_id?: string;
          temp_password?: string | null;
          token?: string;
        };
        Relationships: [];
      };
      teacher_salaries: {
        Row: {
          allowances: number;
          bank_account: string | null;
          base_salary: number;
          created_at: string;
          deductions: number;
          id: string;
          notes: string | null;
          school_id: string;
          teacher_id: string;
          updated_at: string;
        };
        Insert: {
          allowances?: number;
          bank_account?: string | null;
          base_salary?: number;
          created_at?: string;
          deductions?: number;
          id?: string;
          notes?: string | null;
          school_id: string;
          teacher_id: string;
          updated_at?: string;
        };
        Update: {
          allowances?: number;
          bank_account?: string | null;
          base_salary?: number;
          created_at?: string;
          deductions?: number;
          id?: string;
          notes?: string | null;
          school_id?: string;
          teacher_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "teacher_salaries_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          school_id: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          school_id?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          school_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          id: string;
          role: string;
          school_id: string | null;
        };
        Insert: {
          id: string;
          role: string;
          school_id?: string | null;
        };
        Update: {
          id?: string;
          role?: string;
          school_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_school_id_fkey";
            columns: ["school_id"];
            isOneToOne: false;
            referencedRelation: "schools";
            referencedColumns: ["id"];
          },
        ];
      };
      visitor_passes: {
        Row: {
          id: string;
          school_id: string;
          visitor_name: string;
          photo_url: string | null;
          purpose_of_visit: string | null;
          contact_number: string;
          host_name: string | null;
          check_in_time: string;
          check_out_time: string | null;
          pass_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          visitor_name: string;
          photo_url?: string | null;
          purpose_of_visit?: string | null;
          contact_number: string;
          host_name?: string | null;
          check_in_time?: string;
          check_out_time?: string | null;
          pass_number: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          visitor_name?: string;
          photo_url?: string | null;
          purpose_of_visit?: string | null;
          contact_number?: string;
          host_name?: string | null;
          check_in_time?: string;
          check_out_time?: string | null;
          pass_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      id_card_history: {
        Row: {
          id: string;
          school_id: string;
          card_type: string;
          holder_id: string;
          academic_year: string;
          printed_by: string;
          printed_at: string;
          reason: string | null;
        };
        Insert: {
          id?: string;
          school_id: string;
          card_type: string;
          holder_id: string;
          academic_year: string;
          printed_by: string;
          printed_at?: string;
          reason?: string | null;
        };
        Update: {
          id?: string;
          school_id?: string;
          card_type?: string;
          holder_id?: string;
          academic_year?: string;
          printed_by?: string;
          printed_at?: string;
          reason?: string | null;
        };
        Relationships: [];
      };
      exams: {
        Row: {
          id: string;
          school_id: string;
          class_id: string;
          subject_id: string | null;
          name: string;
          type: string;
          date: string;
          max_marks: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          class_id: string;
          subject_id?: string | null;
          name: string;
          type: string;
          date?: string;
          max_marks?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          class_id?: string;
          subject_id?: string | null;
          name?: string;
          type?: string;
          date?: string;
          max_marks?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      exam_marks: {
        Row: {
          id: string;
          school_id: string;
          exam_id: string;
          student_id: string;
          marks_obtained: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          exam_id: string;
          student_id: string;
          marks_obtained: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          exam_id?: string;
          student_id?: string;
          marks_obtained?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ranking_rules: {
        Row: {
          id: string;
          school_id: string;
          criteria: string;
          attendance_weightage: number;
          attendance_threshold: number;
          enabled_categories: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          criteria?: string;
          attendance_weightage?: number;
          attendance_threshold?: number;
          enabled_categories?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          criteria?: string;
          attendance_weightage?: number;
          attendance_threshold?: number;
          enabled_categories?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rankings: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          academic_year: string;
          exam_id: string | null;
          total_marks: number;
          percentage: number;
          gpa: number;
          rank_position: number;
          rank_type: string;
          subject_id: string | null;
          created_at: string;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          academic_year: string;
          exam_id?: string | null;
          total_marks: number;
          percentage: number;
          gpa: number;
          rank_position: number;
          rank_type: string;
          subject_id?: string | null;
          created_at?: string;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          academic_year?: string;
          exam_id?: string | null;
          total_marks?: number;
          percentage?: number;
          gpa?: number;
          rank_position?: number;
          rank_type?: string;
          subject_id?: string | null;
          created_at?: string;
          is_published?: boolean;
        };
        Relationships: [];
      };
      awards: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          academic_year: string;
          category: string;
          title: string;
          description: string;
          issued_by: string | null;
          issued_at: string;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          academic_year: string;
          category: string;
          title: string;
          description: string;
          issued_by?: string | null;
          issued_at?: string;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          academic_year?: string;
          category?: string;
          title?: string;
          description?: string;
          issued_by?: string | null;
          issued_at?: string;
          is_published?: boolean;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          award_id: string | null;
          certificate_type: string;
          certificate_number: string;
          issued_date: string;
          pdf_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          award_id?: string | null;
          certificate_type: string;
          certificate_number: string;
          issued_date?: string;
          pdf_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          award_id?: string | null;
          certificate_type?: string;
          certificate_number?: string;
          issued_date?: string;
          pdf_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      posters: {
        Row: {
          id: string;
          school_id: string;
          student_id: string;
          award_id: string | null;
          theme: string;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          student_id: string;
          award_id?: string | null;
          theme: string;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          student_id?: string;
          award_id?: string | null;
          theme?: string;
          image_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      notification_logs: {
        Row: {
          id: string;
          school_id: string;
          parent_user_id: string;
          student_id: string;
          award_id: string | null;
          type: string;
          title: string;
          body: string;
          status: string;
          sent_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          parent_user_id: string;
          student_id: string;
          award_id?: string | null;
          type: string;
          title: string;
          body: string;
          status?: string;
          sent_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          parent_user_id?: string;
          student_id?: string;
          award_id?: string | null;
          type?: string;
          title?: string;
          body?: string;
          status?: string;
          sent_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      current_school_id: { Args: never; Returns: string };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_staff: { Args: { _user_id: string }; Returns: boolean };
      is_super_admin: { Args: { _user_id: string }; Returns: boolean };
    };
    Enums: {
      app_role: "admin" | "teacher" | "parent" | "super_admin";
      attendance_status: "present" | "absent" | "late" | "half_day";
      homework_file_type: "pdf" | "image" | "none";
      remark_category: "academic" | "behaviour" | "appreciation" | "improvement" | "performance";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher", "parent", "super_admin"],
      attendance_status: ["present", "absent", "late", "half_day"],
      homework_file_type: ["pdf", "image", "none"],
      remark_category: ["academic", "behaviour", "appreciation", "improvement", "performance"],
    },
  },
} as const;

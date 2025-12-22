import { motion } from "framer-motion";
import {
  User,
  Lock,
  Mail,
  Trash2,
  Globe,
  Bell,
  Palette,
  Clock,
  Volume2,
  Mic,
  HelpCircle,
  Phone,
  Shield,
  FileText,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";


export default function SettingsPage({ onBack }) {
  const settingsSections = [
    {
      title: "Account",
      items: [
        { label: "Profile Info", sublabel: "Change your profile information", icon: User },
        { label: "Password", sublabel: "Change your password", icon: Lock },
        { label: "Email", sublabel: "Change your email address", icon: Mail },
        { label: "Delete Account", sublabel: "Permanently delete your account", icon: Trash2 },
      ],
    },
    {
      title: "General",
      items: [
        { label: "Language", sublabel: "English (US)", icon: Globe },
        { label: "Notification", sublabel: "Customize notifications", icon: Bell },
        { label: "Theme", sublabel: "Light mode", icon: Palette },
      ],
    },
    {
      title: "Learning",
      items: [
        { label: "Daily Goal", sublabel: "10 minutes per day", icon: Clock },
        { label: "Sound Effects", sublabel: "On", icon: Volume2 },
        { label: "Speaking Exercises", sublabel: "On", icon: Mic },
      ],
    },
    {
      title: "Help",
      items: [
        { label: "FAQ", sublabel: "Frequently asked questions", icon: HelpCircle },
        { label: "Contact Us", sublabel: "Get in touch with support", icon: Phone },
        { label: "Privacy Policy", sublabel: "Read our privacy policy", icon: Shield },
        { label: "Terms of Service", sublabel: "Read our terms", icon: FileText },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto overflow-x-hidden">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center rounded-full hover:bg-muted h-10 w-10"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * sectionIndex, duration: 0.5 }}
            className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
          >
            <div className="lg:p-6 mb-4 lg:mb-4">
              <h3 className="text-lg font-semibold text-muted-foreground">
                {section.title}
              </h3>
            </div>
            <div className="lg:px-6 lg:pb-6 space-y-2">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={itemIndex}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted transition-all group border-b lg:border-b-0 lg:border-transparent lg:hover:border-border last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-accent" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground text-sm lg:text-base">
                          {item.label}
                        </div>
                        <div className="text-xs lg:text-sm text-muted-foreground">
                          {item.sublabel}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        ))}

        {/* Sign Out Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-transparent lg:bg-card rounded-none lg:rounded-2xl shadow-none lg:shadow-lg border-0 lg:border lg:border-border p-0 lg:p-6"
        >
          <Button className="w-full border border-destructive/20 bg-transparent hover:bg-destructive/10 text-destructive hover:text-destructive/90 lg:rounded-lg">
            <LogOut className="w-5 h-5 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
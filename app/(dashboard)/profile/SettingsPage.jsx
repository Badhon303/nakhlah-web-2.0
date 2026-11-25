"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Bell,
  HelpCircle,
  Info,
  CreditCard,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Moon,
  Mail,
} from "lucide-react"
import { ThemeToggle } from "@/components/nakhlah/ThemeToggle"
import { signOut, getSessionSync } from "@/lib/auth-client"
import { getSessionToken } from "@/lib/authUtils"
import { logoutUser } from "@/services/api/auth"
import { ConfirmPrompt } from "@/components/nakhlah/ConfirmPrompt"

export default function SettingsPage({ onBack, onNavigate }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const accountItems = [
    {
      label: "Personal Info",
      description: "Update your name, photo, and personal details",
      icon: User,
      action: "edit-profile",
    },
    {
      label: "Notifications",
      description: "Control reminders and learning updates",
      icon: Bell,
      action: "notification",
    },
    {
      label: "Payment",
      description: "Manage your membership and Date packages",
      icon: CreditCard,
      action: "payment",
    },
  ]

  const supportItems = [
    {
      label: "FAQs",
      description: "Browse answers and get support",
      icon: HelpCircle,
      action: "help-center",
    },
    {
      label: "Contact Us",
      description: "Talk directly with the Nakhlah team",
      icon: Mail,
      action: "contact-us",
    },
    {
      label: "About Nakhlah",
      description: "Learn more about the app, terms, and policies",
      icon: Info,
      action: "about-nakhlah",
    },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const session = getSessionSync()
      const token = getSessionToken(session)
      await logoutUser(token)
    } catch {
      // ignore network errors, still proceed to clear local session
    }
    await signOut({ redirect: true, callbackUrl: "/auth/login" })
  }

  return (
    <main className="mx-auto max-w-5xl py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-6 overflow-hidden rounded-none bg-gradient-accent text-accent-foreground shadow-none lg:rounded-3xl lg:shadow-lg p-6"
      >
        <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-[30px] bg-white/10" />
        <div className="relative">
          <div className="flex w-full items-center justify-between gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Settings
            </h1>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/25 bg-white/10 px-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/90 sm:text-base">
            Manage your account, choose how Nakhlah keeps in touch, and set your
            appearance.
          </p>
        </div>
      </motion.div>

      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-3xl lg:border lg:border-border lg:bg-card lg:shadow-sm"
        >
          <div className="border-b border-border p-0 lg:p-6">
            <h2 className="text-xl font-extrabold text-foreground">
              Manage your account
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your identity, preferences, and membership in one place.
            </p>
          </div>
          <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {accountItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.button
                  key={item.action}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.06, duration: 0.3 }}
                  onClick={() => onNavigate(item.action)}
                  className="group flex min-h-0 flex-row items-center gap-3 bg-transparent px-0 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent dark:hover:bg-muted/20 lg:bg-card sm:min-h-44 sm:flex-col sm:items-start sm:gap-0 sm:py-4"
                >
                  <IconComponent className="h-8 w-8 shrink-0 text-accent transition-transform group-hover:scale-105 sm:h-9 sm:w-9" />
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:mt-5 sm:w-full sm:flex-none sm:items-start">
                    <span className="min-w-0">
                      <span className="block font-extrabold text-foreground">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                        {item.description}
                      </span>
                    </span>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.4 }}
          className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-3xl lg:border lg:border-border lg:bg-card lg:shadow-sm"
        >
          <div className="border-b border-border p-0 lg:p-6">
            <h2 className="text-xl font-extrabold text-foreground">
              Appearance
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose light, dark, or system appearance for the app.
            </p>
          </div>
          <div className="flex items-center gap-4 px-0 py-4">
            <Moon className="h-8 w-8 shrink-0 text-accent" />
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold text-foreground">
                Theme
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                Follow your device or choose a theme
              </span>
            </span>
            <ThemeToggle size="md" />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="overflow-hidden rounded-none border-0 bg-transparent shadow-none lg:rounded-3xl lg:border lg:border-border lg:bg-card lg:shadow-sm"
        >
          <div className="border-b border-border p-0 lg:p-6">
            <h2 className="text-xl font-extrabold text-foreground">
              Help and information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Get an answer, contact us, or learn more about Nakhlah.
            </p>
          </div>
          <div className="divide-y divide-border">
            {supportItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.button
                  key={item.action}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.22 + index * 0.05, duration: 0.3 }}
                  onClick={() => onNavigate(item.action)}
                  className="group flex w-full items-center gap-4 bg-transparent px-0 py-4 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent dark:hover:bg-muted/20"
                >
                  <IconComponent className="h-8 w-8 shrink-0 text-accent" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-extrabold text-foreground">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24, duration: 0.4 }}
        >
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="group flex w-full items-center gap-4 rounded-none border-x-0 border-t-0 border-b border-destructive/20 bg-transparent px-0 py-4 text-left transition-colors hover:bg-destructive/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive lg:rounded-2xl lg:border lg:bg-card"
          >
            <LogOut className="h-8 w-8 shrink-0 text-destructive" />
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold text-destructive">
                Log out
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                Sign out safely while keeping your progress saved
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-destructive/60 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>
      </div>

      <ConfirmPrompt
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Log out of Nakhlah?"
        description="You'll need to sign in again to continue your learning streak."
        confirmLabel="Log Out"
        cancelLabel="Stay Signed In"
        onConfirm={handleLogout}
        isPending={isLoggingOut}
      />
    </main>
  )
}

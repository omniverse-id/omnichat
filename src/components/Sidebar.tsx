"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { Trans, useTranslation } from "react-i18next"
import {
  Settings,
  Download,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Search,
  SquarePen,
  Trash2,
  X,
} from "lucide-react"
import { useNavigate } from "react-router"
import IndexedDB from "../database/indexedDB"
import useFilter from "../hooks/useFilter"
import { useChatContext } from "../store/chat"
import { useModals } from "../store/modal"
import { useAppContext } from "../store/app"
import type { Conversation } from "../types"
import { downloadAsFile } from "../utils/downloadAsFile"
import { Button } from "./Button"

export default function Sidebar() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const toggleDrawerRef = useRef<HTMLInputElement>(null)

  const { isSidebarOpen, toggleSidebar } = useAppContext()

  const { t: _t } = useTranslation()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [, setIsMobileDrawerOpen] = useState(false)

  const {
    filteredData: filteredConversations,
    setFilter,
    resetFilter,
    searchTerm,
    isFiltered,
  } = useFilter(conversations)

  useEffect(() => {
    const handleConversationChange = async () => {
      setConversations(await IndexedDB.getAllConversations())
    }
    IndexedDB.onConversationChanged(handleConversationChange)
    handleConversationChange()
    return () => {
      IndexedDB.offConversationChanged(handleConversationChange)
    }
  }, [])

  const groupedConv = useMemo(
    () => groupConversationsByDate(conversations, i18n.language),
    [i18n.language, conversations],
  )

  const handleSelect = useCallback(() => {
    const toggle = toggleDrawerRef.current
    if (toggle != null) {
      // Only toggle checkbox on mobile view
      const isMobile = window.innerWidth < 1280 // xl breakpoint
      if (isMobile) {
        toggle.checked = false
        setIsMobileDrawerOpen(false)
        toggle.dispatchEvent(new Event("change", { bubbles: true }))
      }
    }
  }, [])

  const handleToggleSidebar = () => {
    toggleSidebar()
  }

  return (
    <>
      {/* Mobile drawer toggle - only used on mobile */}
      <input
        id="toggle-drawer"
        type="checkbox"
        className="hidden xl:hidden"
        ref={toggleDrawerRef}
        aria-label="Toggle sidebar"
        onChange={(e) => setIsMobileDrawerOpen(e.target.checked)}
      />

      {/* Mobile drawer overlay and sidebar */}
      <div className="drawer-side xl:hidden z-50" role="complementary" aria-label="Sidebar" tabIndex={0}>
        <label htmlFor="toggle-drawer" className="drawer-overlay" aria-label="Close sidebar" />
        <div className="flex flex-col bg-sidebar text-sidebar-foreground h-full min-h-0 max-w-full w-96 pb-4 px-4 shadow-xl">
          {/* Mobile Close Button */}
          <div className="flex flex-row items-center justify-between pt-2">
            <label
              htmlFor="toggle-drawer"
              className="cursor-pointer"
              title={t("sidebar.buttons.closeSideBar")}
            >
              <Button
                variant="ghost"
                size="icon-xl"
              >
                <PanelLeftClose className="h-5 w-5" />
              </Button>
            </label>

            <button
              className="font-bold tracking-wider leading-8 uppercase hover:bg-sidebar-accent rounded-md px-3 py-2 transition-colors"
              aria-label={import.meta.env.VITE_APP_NAME}
              onClick={() => navigate("/")}
            >
              {import.meta.env.VITE_APP_NAME}
            </button>

            <Button
              variant="ghost"
              size="icon-xl"
              onClick={() => navigate("/settings")}
              title={t("header.buttons.settings")}
              aria-label={t("header.ariaLabels.settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex mt-2">
            <div className="flex items-center gap-2 h-8 my-1.5 px-2 rounded-md border border-sidebar-border bg-sidebar">
              <Search className="h-4 w-4" />
              <input
                className="grow bg-transparent outline-none text-sm"
                name="Search"
                placeholder={t("sidebar.searchPlaceHolder")}
                value={searchTerm}
                onChange={(e) => setFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return
                  if (e.key === "Escape" && !e.shiftKey) {
                    e.preventDefault()
                    resetFilter()
                  }
                }}
                autoFocus
              />
              {isFiltered && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={resetFilter}
                  title={t("header.buttons.clear")}
                  aria-label={t("header.ariaLabels.clear")}
                  className="p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            {!isFiltered &&
              groupedConv.map((group, idx) => (
                <ConversationGroup
                  className={idx > 0 ? "mt-6" : "mt-3"}
                  key={group.title}
                  group={group}
                  onItemSelect={handleSelect}
                />
              ))}

            {isFiltered &&
              filteredConversations.map((conv) => (
                <ConversationItem key={conv.id} conv={conv} onSelect={handleSelect} />
              ))}
          </div>

          <div className="text-center text-xs opacity-75 mx-4 pt-4">
            <Trans i18nKey="sidebar.storageNote" />
          </div>
        </div>
      </div>

      {/* Desktop sidebar - separate from drawer, no overlay */}
      <div
        className={`hidden xl:flex flex-col bg-sidebar text-sidebar-foreground h-screen border-r border-sidebar-border shadow-sm transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "w-96" : "w-0"
        }`}
        role="complementary"
        aria-label="Sidebar"
      >
        <div className="flex flex-col bg-sidebar h-full min-h-0 pb-4 px-2">
          <div className="flex flex-row items-center justify-between py-2">
            {/* Desktop Toggle Button */}
            <Button
              variant="ghost"
              size="icon-xl"
              onClick={handleToggleSidebar}
              title={isSidebarOpen ? t("sidebar.buttons.closeSideBar") : t("sidebar.buttons.openSideBar")}
              aria-label={isSidebarOpen ? t("sidebar.buttons.closeSideBar") : t("sidebar.buttons.openSideBar")}
            >
              {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
            </Button>

            <button
              className="font-bold tracking-wider leading-8 uppercase whitespace-nowrap hover:bg-sidebar-accent rounded-md px-3 py-2 transition-colors"
              aria-label={import.meta.env.VITE_APP_NAME}
              onClick={() => navigate("/")}
            >
              {import.meta.env.VITE_APP_NAME}
            </button>

            <Button
              variant="ghost"
              size="icon-xl"
              onClick={() => navigate("/")}
              title={t("header.buttons.newConv")}
              aria-label={t("header.ariaLabels.newConv")}
            >
              <SquarePen className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex px-2">
            <div className="flex items-center gap-2 h-8 my-1.5 px-2 rounded-md border border-sidebar-border bg-sidebar-accent">
              <Search className="h-4 w-4" />
              <input
                className="grow bg-transparent outline-none text-sm"
                name="Search"
                placeholder={t("sidebar.searchPlaceHolder")}
                value={searchTerm}
                onChange={(e) => setFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return
                  if (e.key === "Escape" && !e.shiftKey) {
                    e.preventDefault()
                    resetFilter()
                  }
                }}
                autoFocus
              />
              {isFiltered && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={resetFilter}
                  title={t("header.buttons.clear")}
                  aria-label={t("header.ariaLabels.clear")}
                  className="p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div
            className={`flex-1 overflow-y-auto overflow-x-hidden min-h-0 transition-opacity duration-300 ${
              isSidebarOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {!isFiltered &&
              groupedConv.map((group, idx) => (
                <ConversationGroup
                  className={idx > 0 ? "mt-6" : "mt-3"}
                  key={group.title}
                  group={group}
                  onItemSelect={handleSelect}
                />
              ))}

            {isFiltered &&
              filteredConversations.map((conv) => (
                <ConversationItem key={conv.id} conv={conv} onSelect={handleSelect} />
              ))}
          </div>

          <div
            className={`text-xs px-4 py-2 transition-opacity duration-300 whitespace-nowrap overflow-hidden ${
              isSidebarOpen ? "opacity-75" : "opacity-0"
            }`}
          >
            <Trans i18nKey="sidebar.storageNote" />
          </div>
        </div>
      </div>
    </>
  )
}

const ConversationGroup = memo(
  ({
    className,
    group,
    onItemSelect,
  }: {
    className?: string
    group: GroupedConversations
    onItemSelect: () => void
  }) => {
    const { t } = useTranslation()

    return (
      <div role="group" className={className}>
        <div
          className="px-2 opacity-75 pb-1 text-xs font-bold text-sidebar-foreground"
          role="note"
          aria-description={t(`sidebar.groups.${group.title}`, {
            defaultValue: group.title,
          })}
          tabIndex={0}
        >
          <Trans i18nKey={`sidebar.groups.${group.title}`} defaults={group.title} />
        </div>

        <ul>
          {group.conversations.map((conv) => (
            <ConversationItem key={conv.id} conv={conv} onSelect={onItemSelect} />
          ))}
        </ul>
      </div>
    )
  },
)

const ConversationItem = memo(({ conv, onSelect }: { conv: Conversation; onSelect: () => void }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { viewingChat, isGenerating } = useChatContext()
  const { showConfirm, showPrompt } = useModals()

  const isCurrent = useMemo(() => viewingChat?.conv?.id === conv.id, [conv.id, viewingChat?.conv?.id])

  const isPending = useMemo(() => isGenerating(conv.id), [conv.id, isGenerating])

  const handleSelect = () => {
    onSelect()
    navigate(`/chat/${conv.id}`)
  }

  const handleRename = async () => {
    if (isPending) {
      toast.error(t("sidebar.errors.renameOnGenerate"))
      return
    }
    const newName = await showPrompt(t("sidebar.actions.newName"), conv.name)
    if (newName && newName.trim().length > 0) {
      IndexedDB.updateConversationName(conv.id, newName)
    }
  }

  const handleDownload = async () => {
    if (isPending) {
      toast.error(t("sidebar.errors.downloadOnGenerate"))
      return
    }
    return IndexedDB.exportDB(conv.id).then((data) =>
      downloadAsFile([JSON.stringify(data, null, 2)], `conversation_${conv.id}.json`),
    )
  }

  const handleDelete = async () => {
    if (isPending) {
      toast.error(t("sidebar.errors.deleteOnGenerate"))
      return
    }
    if (await showConfirm(t("sidebar.actions.deleteConfirm"))) {
      toast.success(t("sidebar.actions.deleteSuccess"))
      IndexedDB.deleteConversation(conv.id)
      navigate("/")
    }
  }

  return (
    <li
      role="menuitem"
      tabIndex={0}
      aria-label={conv.name}
      className={`group flex flex-row h-9 justify-start items-center font-normal px-2 rounded-md transition-colors ${
        isCurrent ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent"
      }`}
    >
      <button
        type="button"
        key={conv.id}
        className="w-full overflow-hidden truncate text-start"
        onClick={handleSelect}
        dir="auto"
        title={conv.name}
        aria-label={t("sidebar.ariaLabels.select", { name: conv.name })}
      >
        {conv.name}
      </button>

      <div className="dropdown dropdown-end">
        <Button
          className="h-auto w-auto opacity-0 group-hover:opacity-100 transition-opacity"
          variant="ghost"
          size="icon"
          onClick={() => {}}
          title={t("sidebar.buttons.more")}
          aria-label={t("sidebar.ariaLabels.more")}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
        <ul
          aria-label={t("sidebar.ariaLabels.dropdown")}
          role="menu"
          tabIndex={-1}
          className="dropdown-content menu bg-popover text-popover-foreground rounded-md z-[1] p-1 shadow"
        >
          <li role="menuitem" onClick={handleRename}>
            <Button
              variant="ghost"
              size="small"
              className="justify-start text-sm"
              title={t("sidebar.buttons.rename")}
            >
              <Pencil className="h-4 w-4" />
              <Trans i18nKey="sidebar.buttons.rename" />
            </Button>
          </li>
          <li role="menuitem" onClick={handleDownload}>
            <Button
              variant="ghost"
              size="small"
              className="justify-start text-sm"
              title={t("sidebar.buttons.download")}
            >
              <Download className="h-4 w-4" />
              <Trans i18nKey="sidebar.buttons.download" />
            </Button>
          </li>
          <li role="menuitem" onClick={handleDelete}>
            <Button
              variant="ghost"
              size="small"
              className="justify-start text-sm text-destructive hover:text-destructive"
              title={t("sidebar.buttons.delete")}
            >
              <Trash2 className="h-4 w-4" />
              <Trans i18nKey="sidebar.buttons.delete" />
            </Button>
          </li>
        </ul>
      </div>
    </li>
  )
})

export interface GroupedConversations {
  title?: string
  conversations: Conversation[]
}

export function groupConversationsByDate(conversations: Conversation[], language = "default"): GroupedConversations[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)

  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const groups: { [key: string]: Conversation[] } = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    "Previous 30 Days": [],
  }
  const monthlyGroups: { [key: string]: Conversation[] } = {}

  const sortedConversations = [...conversations].sort((a, b) => b.lastModified - a.lastModified)

  for (const conv of sortedConversations) {
    const convDate = new Date(conv.lastModified)

    if (convDate >= today) {
      groups["Today"].push(conv)
    } else if (convDate >= yesterday) {
      groups["Yesterday"].push(conv)
    } else if (convDate >= sevenDaysAgo) {
      groups["Previous 7 Days"].push(conv)
    } else if (convDate >= thirtyDaysAgo) {
      groups["Previous 30 Days"].push(conv)
    } else {
      const monthName = convDate.toLocaleString(language, { month: "long" })
      const year = convDate.getFullYear()
      const monthYearKey = `${monthName} ${year}`
      if (!monthlyGroups[monthYearKey]) {
        monthlyGroups[monthYearKey] = []
      }
      monthlyGroups[monthYearKey].push(conv)
    }
  }

  const result: GroupedConversations[] = []

  if (groups["Today"].length > 0) {
    result.push({
      title: "Today",
      conversations: groups["Today"],
    })
  }

  if (groups["Yesterday"].length > 0) {
    result.push({
      title: "Yesterday",
      conversations: groups["Yesterday"],
    })
  }

  if (groups["Previous 7 Days"].length > 0) {
    result.push({
      title: "Previous 7 Days",
      conversations: groups["Previous 7 Days"],
    })
  }

  if (groups["Previous 30 Days"].length > 0) {
    result.push({
      title: "Previous 30 Days",
      conversations: groups["Previous 30 Days"],
    })
  }

  const sortedMonthKeys = Object.keys(monthlyGroups).sort((a, b) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateB.getTime() - dateA.getTime()
  })

  for (const monthKey of sortedMonthKeys) {
    if (monthlyGroups[monthKey].length > 0) {
      result.push({ title: monthKey, conversations: monthlyGroups[monthKey] })
    }
  }

  return result
}

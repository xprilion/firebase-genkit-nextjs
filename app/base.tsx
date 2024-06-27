"use client"

import { useState, useEffect} from "react"
import Link from "next/link"
import {Dialog, DialogTrigger, DialogContent, DialogFooter} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Input} from "@/components/ui/input"
import { PaperPlaneIcon, Component1Icon, GearIcon } from "@radix-ui/react-icons";
import ChatUi from "@/app/chat";
import {Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem} from "@/components/ui/select";

export default function BaseUi() {
	const [theme, setTheme] = useState("system")
	const [modelId, setModelId] = useState("")
	
	useEffect(() => {
		const handleThemeChange = () => {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
			setTheme(systemTheme)
		}
		handleThemeChange()
		window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handleThemeChange)
		return () => {
			window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", handleThemeChange)
		}
	}, [])
	
	useEffect(() => {
		document.documentElement.classList.remove("light", "dark")
		document.documentElement.classList.add(theme)
	}, [theme])
	
	useEffect(() => {
		const storedData = localStorage.getItem('modelId');
		if (storedData) {
			setModelId(storedData);
		}
	}, []);
	
	// Save data to local storage whenever it changes
	useEffect(() => {
		localStorage.setItem('modelId', modelId);
	}, [modelId]);
	
	return (
		<div className={`flex flex-col h-screen ${theme === "dark" ? "dark" : ""}`}>
			<header className="bg-gray-950 text-white flex items-center justify-between px-4 py-3 shadow-md border-b-[1px] border-b-foreground-muted">
				<Link href="#" className="flex items-center gap-2" prefetch={false}>
					<Component1Icon className="h-6 w-6"/>
					<span className="text-lg font-medium">Genkit Ollama</span><span>&middot;</span><span>{modelId}</span>
				</Link>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="ghost" size="icon"
						        className="rounded-full hover:bg-gray-900 focus:bg-gray-900">
							<GearIcon className="h-5 w-5"/>
							<span className="sr-only">Settings</span>
						</Button>
					</DialogTrigger>
					<DialogContent className="w-80 p-6 space-y-4">
						<div className="grid gap-2">
							<Label htmlFor="theme">Theme</Label>
							<RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-2">
								<div className={"flex flex-row items-center"}>
									<RadioGroupItem id="theme-light" value="light"/>
									<Label htmlFor="theme-light" className="cursor-pointer ml-2">
										Light
									</Label>
								</div>
								<div className={"flex flex-row items-center"}>
									<RadioGroupItem id="theme-dark" value="dark"/>
									<Label htmlFor="theme-dark" className="cursor-pointer ml-2">
										Dark
									</Label>
								</div>
								<div className={"flex flex-row items-center"}>
									<RadioGroupItem id="theme-system" value="system"/>
									<Label htmlFor="theme-system" className="cursor-pointer ml-2">
										System
									</Label>
								</div>
							</RadioGroup>
						</div>
						<div className={"grid gap-2"}>
							<Label htmlFor="model">Model</Label>
							<Select value={modelId} onValueChange={(v) => setModelId(v)}>
								<SelectTrigger>
									<SelectValue placeholder="Select an llm model" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
									<SelectItem key={`llm-model-gemma2-9b`} value={"gemma2:9b"}>Gemma2 9b</SelectItem>
										<SelectItem key={`llm-model-gemma-2b`} value={"gemma:2b"}>Gemma 2b</SelectItem>
										<SelectItem key={`llm-model-qwen2-500m`} value={"qwen2:0.5b"}>Qwen2 0.5b</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</DialogContent>
				</Dialog>
			</header>
			<ChatUi />
		</div>
	)
}
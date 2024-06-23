import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import MarkdownRenderer from "@/components/md-render";

interface ChatMessage {
	message: string;
	timestamp?: Date;
	from?: string;
}

export default function BotChatBubble (message: ChatMessage) {
	
	return (
		<div className="flex items-start gap-3 ml-2">
			<Avatar className="w-8 h-8 shrink-0">
				<AvatarImage src="/placeholder-user.jpg"/>
				<AvatarFallback>B</AvatarFallback>
			</Avatar>
			<div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl max-w-[70%] text-sm">
				<MarkdownRenderer markdown={message.message} />
			</div>
		</div>
	)
}
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface ChatMessage {
	message: string;
	timestamp?: Date;
	from?: string;
}

export default function UserChatBubble (message: ChatMessage) {
	return (
		<div className="flex items-start gap-3 justify-end">
			<div className="bg-blue-500 text-white px-4 py-2 rounded-2xl max-w-[70%]">
				<p className="text-sm">
					{message.message}
				</p>
			</div>
			<Avatar className="w-8 h-8 shrink-0">
				<AvatarImage src="/placeholder-user.jpg"/>
				<AvatarFallback>U</AvatarFallback>
			</Avatar>
		</div>
	)
}

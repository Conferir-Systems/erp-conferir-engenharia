import { useState, ReactNode } from 'react'

type TooltipProps = {
	trigger: ReactNode
	content: ReactNode
}

export const Tooltip = ({ trigger, content }: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false)

	return (
		<div className="relative inline-block">
			<div
				onMouseEnter={() => setIsVisible(true)}
				onMouseLeave={() => setIsVisible(false)}
				className="cursor-pointer hover:underline"
			>
				{trigger}
			</div>
			<div
				className={`absolute z-50 mt-2 left-0 transition-all duration-200 ${isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'}`}
			>
				<div className="relative bg-white border border-border rounded-lg shadow-lg p-4 min-w-[250px]">
					<div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-border rotate-45" />
					<div className="relative">{content}</div>
				</div>
			</div>
		</div>
	)
}

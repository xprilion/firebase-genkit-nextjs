export default function LoadingBar () {
	return (
		<div className='w-full'>
			<div className='h-[1px] w-full overflow-hidden'>
				<div className='animate-progress w-full h-full bg-blue-600 origin-left-right'></div>
			</div>
		</div>
	)
}
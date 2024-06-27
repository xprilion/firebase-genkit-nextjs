type ModelMap = {
	[key: string]: string | undefined;
}
export const MODEL_MAP : ModelMap = {
	"gemma2:9b": process.env.API_BASE_GEMMA2_9B,
	"gemma:2b": process.env.API_BASE_GEMMA_2B,
	"qwen2:0.5b": process.env.API_BASE_QWEN2_500M,
}
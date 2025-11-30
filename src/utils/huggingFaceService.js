import { HfInference } from '@huggingface/inference';

/**
 * Comprehensive Hugging Face service with multiple fallback strategies
 * Optimized for free tier usage with local model support
 */
class HuggingFaceService {
    constructor(apiToken) {
        this.apiToken = apiToken;
        this.inference = new HfInference(apiToken);
        
        // Models optimized for different use cases and free tier
        this.modelConfigs = {
            // Text generation models (small, fast, free-tier friendly)
            textGeneration: [
                { name: "distilgpt2", description: "Small GPT-2 variant", maxTokens: 50 },
                { name: "gpt2", description: "Original GPT-2", maxTokens: 100 },
                { name: "microsoft/DialoGPT-small", description: "Conversational model", maxTokens: 50 }
            ],
            
            // Code generation models
            codeGeneration: [
                { name: "microsoft/CodeGPT-small-py", description: "Python code generation", maxTokens: 100 },
                { name: "distilgpt2", description: "General text/code", maxTokens: 50 }
            ],
            
            // HTML/CSS generation models
            htmlGeneration: [
                { name: "distilgpt2", description: "General text generation", maxTokens: 100 },
                { name: "gpt2", description: "Larger context model", maxTokens: 150 }
            ]
        };
    }

    /**
     * Generate text using the best available model for the use case
     */
    async generateText(input, useCase = 'textGeneration', options = {}) {
        const models = this.modelConfigs[useCase] || this.modelConfigs.textGeneration;
        const defaultOptions = {
            max_new_tokens: 20,
            temperature: 0.7,
            do_sample: true
        };
        
        const finalOptions = { ...defaultOptions, ...options };

        for (const model of models) {
            try {
                console.log(`🔄 Trying ${model.name} for ${useCase}...`);
                
                const result = await this.inference.textGeneration({
                    model: model.name,
                    inputs: input,
                    parameters: {
                        ...finalOptions,
                        max_new_tokens: Math.min(finalOptions.max_new_tokens, model.maxTokens)
                    }
                });

                console.log(`✅ Success with ${model.name}!`);
                return {
                    success: true,
                    model: model.name,
                    generated_text: result.generated_text,
                    full_response: result
                };

            } catch (error) {
                console.error(`❌ ${model.name} failed:`, error.message);
                
                // Check for rate limits or credit issues
                if (this.isRateLimitError(error)) {
                    console.log("💳 Rate limit or credit issue detected");
                    break;
                }
            }
        }

        // Fallback to direct API call
        return await this.fallbackDirectAPI(input, finalOptions);
    }

    /**
     * Generate HTML content specifically for documents
     */
    async generateHTML(prompt, options = {}) {
        const htmlPrompt = `<!DOCTYPE html>
<html>
<head>
<style>
/* Professional Document CSS */
${prompt}`;

        return await this.generateText(htmlPrompt, 'htmlGeneration', {
            max_new_tokens: 100,
            temperature: 0.8,
            ...options
        });
    }

    /**
     * Generate CSS styles
     */
    async generateCSS(prompt, options = {}) {
        const cssPrompt = `/* Professional CSS Styles */
${prompt}`;

        return await this.generateText(cssPrompt, 'htmlGeneration', {
            max_new_tokens: 80,
            temperature: 0.7,
            ...options
        });
    }

    /**
     * Fallback to direct API call if SDK fails
     */
    async fallbackDirectAPI(input, options) {
        console.log("🔄 Trying direct API call as fallback...");
        
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/distilgpt2", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: input,
                    parameters: {
                        max_new_tokens: Math.min(options.max_new_tokens, 20),
                        temperature: options.temperature,
                        do_sample: options.do_sample
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Direct API call successful!");
                return {
                    success: true,
                    model: "distilgpt2 (direct API)",
                    generated_text: data[0]?.generated_text || data.generated_text,
                    full_response: data
                };
            } else {
                const errorText = await response.text();
                return {
                    success: false,
                    error: `API call failed: ${response.status} - ${errorText}`,
                    status: response.status
                };
            }
        } catch (error) {
            return {
                success: false,
                error: `Direct API call failed: ${error.message}`
            };
        }
    }

    /**
     * Check if error is related to rate limits or credits
     */
    isRateLimitError(error) {
        const message = error.message.toLowerCase();
        return message.includes("rate") || 
               message.includes("credit") || 
               message.includes("quota") ||
               message.includes("limit");
    }

    /**
     * Get usage information and tips
     */
    getUsageTips() {
        return {
            freeTierLimits: {
                monthlyCredits: "$0.10",
                description: "Limited monthly credits for API calls"
            },
            optimizationTips: [
                "Use smaller models like distilgpt2",
                "Keep max_new_tokens low (5-50)",
                "Monitor usage at https://huggingface.co/settings/billing",
                "Consider local model inference for heavy usage"
            ],
            billingUrl: "https://huggingface.co/settings/billing"
        };
    }

    /**
     * Test the service with a simple example
     */
    async testService() {
        console.log("🧪 Testing Hugging Face Service...");
        
        try {
            const result = await this.generateText("Hello, how are you?", 'textGeneration', {
                max_new_tokens: 10
            });

            if (result.success) {
                console.log("✅ Service test successful!");
                console.log(`Model used: ${result.model}`);
                console.log(`Generated: ${result.generated_text}`);
                return true;
            } else {
                console.log("❌ Service test failed:", result.error);
                return false;
            }
        } catch (error) {
            console.error("❌ Service test error:", error.message);
            return false;
        }
    }
}

// Export the service class
export default HuggingFaceService;

// Export a convenience function for quick setup
export function createHuggingFaceService(apiToken) {
    return new HuggingFaceService(apiToken);
}

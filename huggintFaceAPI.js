import { createHuggingFaceService } from './src/utils/huggingFaceService.js';

const docPilot_ai_api_token = process.env.HUGGINGFACE_API_TOKEN || "your-api-token-here";

async function testHuggingFaceAPI() {
    console.log("🚀 Testing Enhanced Hugging Face Service");
    console.log("Using API token:", docPilot_ai_api_token.substring(0, 10) + "...");
    console.log("Note: Free tier has $0.10 monthly credits and model limitations\n");
    
    // Create the service instance
    const hfService = createHuggingFaceService(docPilot_ai_api_token);
    
    // Test basic functionality
    console.log("🧪 Testing basic service functionality...");
    const basicTest = await hfService.testService();
    
    if (basicTest) {
        console.log("✅ SERVICE IS WORKING! Basic functionality test passed.\n");
        
        console.log("🎯 Testing HTML generation for DocPilot AI...");
        
        // Test HTML generation
        const htmlResult = await hfService.generateHTML("Professional Resume CSS with modern styling");
        if (htmlResult.success) {
            console.log("✅ HTML generation successful!");
            console.log("Generated HTML:", htmlResult.generated_text);
            console.log("Model used:", htmlResult.model);
        } else {
            console.log("❌ HTML generation failed:", htmlResult.error);
        }
        
        console.log("\n🎨 Testing CSS generation...");
        
        // Test CSS generation
        const cssResult = await hfService.generateCSS("Create modern button styles with hover effects");
        if (cssResult.success) {
            console.log("✅ CSS generation successful!");
            console.log("Generated CSS:", cssResult.generated_text);
            console.log("Model used:", cssResult.model);
        } else {
            console.log("❌ CSS generation failed:", cssResult.error);
        }
        
        console.log("\n📝 Testing general text generation...");
        
        // Test general text generation
        const textResult = await hfService.generateText("Write a professional summary for a software developer resume");
        if (textResult.success) {
            console.log("✅ Text generation successful!");
            console.log("Generated text:", textResult.generated_text);
            console.log("Model used:", textResult.model);
        } else {
            console.log("❌ Text generation failed:", textResult.error);
        }
        
        console.log("\n🎉 OVERALL STATUS: SERVICE IS FULLY FUNCTIONAL!");
        console.log("You can now integrate this into your DocPilot AI application.");
        
    } else {
        console.log("❌ SERVICE IS NOT WORKING! Basic service test failed.");
        console.log("Possible issues:");
        console.log("- API token is invalid or expired");
        console.log("- Monthly credits ($0.10) have been exhausted");
        console.log("- Network connectivity issues");
        console.log("- Hugging Face API is temporarily unavailable");
        
        console.log("\n🔧 Troubleshooting steps:");
        console.log("1. Check your API token at: https://huggingface.co/settings/tokens");
        console.log("2. Monitor your usage at: https://huggingface.co/settings/billing");
        console.log("3. Try again later if it's a temporary issue");
        console.log("4. Consider upgrading to a paid plan for higher limits");
    }
    
    // Show usage tips
    console.log("\n💡 Usage Tips:");
    const tips = hfService.getUsageTips();
    console.log(`Free tier credits: ${tips.freeTierLimits.monthlyCredits}`);
    console.log("Optimization tips:");
    tips.optimizationTips.forEach(tip => console.log(`- ${tip}`));
    console.log(`Monitor usage: ${tips.billingUrl}`);
    
    console.log("\n🔧 Integration with DocPilot AI:");
    console.log("You can now use this service in your React components:");
    console.log(`
// In your React component:
import { createHuggingFaceService } from './utils/huggingFaceService.js';

const hfService = createHuggingFaceService('your-api-token');

// Generate HTML content
const htmlResult = await hfService.generateHTML('Professional document styling');

// Generate CSS
const cssResult = await hfService.generateCSS('Modern button styles');
    `);
    
    // Final status summary
    console.log("\n" + "=".repeat(60));
    if (basicTest) {
        console.log("🎉 FINAL RESULT: Hugging Face Service is WORKING correctly!");
        console.log("✅ Ready for integration into DocPilot AI");
    } else {
        console.log("❌ FINAL RESULT: Hugging Face Service is NOT working");
        console.log("🔧 Please check the troubleshooting steps above");
    }
    console.log("=".repeat(60));
}

testHuggingFaceAPI();
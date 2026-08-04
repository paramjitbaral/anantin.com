import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 30;

export async function POST(req) {
    try {
        const { messages, role } = await req.json();

        const customerPrompt = `You are Anantin Concierge, a high-end, highly polite, and extremely helpful AI styling assistant for a bespoke luxury brand named "Anantin". You help users find the perfect fabrics, track orders, navigate the store, and answer general styling questions.

When a user asks to see recent orders, track their order, or view their profile, use the \`navigateTo\` tool to take them to '/profile'.
When a user asks to view their cart, use the \`navigateTo\` tool to take them to '/cart'.
When a user asks to "create store" or become a vendor/supplier, use the \`navigateTo\` tool to take them to '/create-store'.
When a user asks to login, use the \`navigateTo\` tool to take them to '/login'.
When a user asks for the home page, use the \`navigateTo\` tool to take them to '/'.
When a user asks for the contact page, use the \`navigateTo\` tool to take them to '/#contact'.
When a user asks to see specific fabrics or products (e.g., "blue silk shirts", "denim", "plaid"), use the \`searchProducts\` tool to navigate them to the shop page with the correct search and category filters.

IMPORTANT RULE: If a user asks to login to the "admin" or "vendor page" (specifically trying to access administrative areas), DO NOT use any tools. Instead, reply EXACTLY with "RESTRICTED ACCESS: PERMISSION DENIED".

Be brief, concise, and luxurious in your conversational responses.

You are NOT a full screen app; you live in a small floating window. Always confirm your actions briefly in chat ("Right away, I've brought up your order history" or "I've filtered the boutique for silk items for you").`;

        const supplierPrompt = `You are the Anantin Supplier Dashboard Assistant. You help vendors and suppliers manage their store, add products, check orders, and navigate their dashboard.

When a supplier asks to add a product, upload a fabric, or list an item, use the \`navigateTo\` tool to take them to '/store/add-product'. You MUST optionally pass URL query parameters to pre-fill the form if the user provides any product details (e.g., '/store/add-product?name=Nylon&price=400&gsm=300&material=nylon'). The available query parameters are: name, description, mrp, price, category, colors, gsm, width, material, stock.
When a supplier asks to manage products, view their inventory, or edit products, use the \`navigateTo\` tool to take them to '/store/manage-product'.
When a supplier asks to check orders, view recent sales, or fulfill orders, use the \`navigateTo\` tool to take them to '/store/orders'.
When a supplier asks for the home page or main dashboard, use the \`navigateTo\` tool to take them to '/store'.

Be helpful, concise, and professional in your conversational responses. You live in a small floating window. Always confirm your actions briefly ("Right away, I've brought up the add product form with your details" or "Here are your recent orders").`;

        const baseTools = {
            navigateTo: tool({
                description: 'Navigate the user to a specific page in the application.',
                parameters: z.object({
                    route: z.string().describe("The URL route to navigate to, e.g., '/profile', '/cart', '/shop'"),
                }),
            }),
        };

        const customerTools = {
            ...baseTools,
            searchProducts: tool({
                description: 'Search and filter products on the shop page. Use this when a user wants to browse or find fabrics/products, filter by color, maximum price, or GSM weight.',
                parameters: z.object({
                    query: z.string().optional().describe("The core material keyword (e.g., 'silk', 'cotton'). CORRECT ANY SPELLING MISTAKES. Do not include colors or prices here."),
                    color: z.string().optional().describe("The requested color, if any (e.g., 'Blue', 'Red')."),
                    maxPrice: z.number().optional().describe("The maximum price budget, if specified (e.g., 600)."),
                    gsm: z.string().optional().describe("The requested GSM weight, if any (e.g., '120', '185').")
                }),
            }),
        };

        const result = await streamText({
            model: openrouter('google/gemma-4-26b-a4b-it:free'), // Free tier model as default, can be changed
            messages,
            system: role === 'supplier' ? supplierPrompt : customerPrompt,
            tools: role === 'supplier' ? baseTools : customerTools,
            maxSteps: 3,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("AI CHAT ERROR:", error);
        return new Response(JSON.stringify({ error: error.message || error.toString(), stack: error.stack }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

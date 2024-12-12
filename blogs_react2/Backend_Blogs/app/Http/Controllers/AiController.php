<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    // public function getAnswerFromArticle(Request $request)
    // {
    //     // Validate the input
    //     $request->validate([
    //         'article' => 'required|string',
    //         'question' => 'required|string',
    //     ]);

    //     // Extract article text and question from the request
    //     $article = $request->input('article');
    //     $question = $request->input('question');

    //     // Prepare the OpenAI API request
    //     $response = Http::withHeaders([
    //         'Content-Type' => 'application/json',
    //         'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
    //     ])->post('https://api.openai.com/v1/chat/completions', [
    //         'model' => 'gpt-4',
    //         'messages' => [
    //             [
    //                 'role' => 'system',
    //                 'content' => 'You are a helpful assistant. Answer questions only based on the provided article text.'
    //             ],
    //             [
    //                 'role' => 'user',
    //                 'content' => "Here is the article:\n\n$article\n\nBased on this article, answer the following question: $question"
    //             ],
    //         ],
    //     ]);

    //     // Extract the response content
    //     $result = $response->json()['choices'][0]['message']['content'];

    //     // Return the answer
    //     return response()->json(['answer' => $result]);
    // }

    public function getAnswerFromArticle(Request $request)
    {
        $apiKey = env('GOOGLE_API_KEY');  // Store your API key in the .env file
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={$apiKey}";
    
        // Validate the incoming request
        $request->validate([
            'question' => 'required|string',
            'article' => 'required|string',
        ]);
    
        $question = $request->input('question');
        $article = $request->input('article');
    
        // Prepare the content for the request to the AI API
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($url, [
            'contents' => [
                [
                    'parts' => [
                        [
                            // 'text' => "Article: {$article} \n\nQuestion: {$question}"
                            'text' => "You are a helpful assistant. Answer questions only based on the provided article text. Here is the article:\n\n$article\n\nBased on this article, answer the following question: $question"
                        ]
                    ]
                ]
            ]
        ]);
    
        // Check if the request was successful
        if ($response->successful()) {
            $answer = $response->json(); // Extract the answer from the API response
            
            // Extract the text from the response
            // $text = $answer['answer']['candidates'][0]['content']['parts'][0]['text'];
            $text = $answer['candidates'][0]['content']['parts'][0]['text'];
    
            return response()->json([
                'answer' => $text
            ]);
        }
    
        // Handle error
        return response()->json(['error' => 'Failed to generate content'], 500);
    }
    

    public function handleArticleInput(Request $request)
    {
        $apiKey = env('GOOGLE_API_KEY');  // Store your API key in the .env file
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={$apiKey}";
    
        // Validate the incoming request
        $request->validate([
            'input' => 'required|string',
        ]);
    
        $userInput = $request->input('input');
    
        // Prepare a smart prompt
        $prompt = <<<EOT
        You are a professional writer and editor. Based on the user's input:
        1. If the input is an article, refine it to improve clarity, grammar, and flow.
        2. If the input is a topic, write a detailed and engaging article about the topic.
        3. If the input includes key points, write an article using these points as a structure.
        4. If the input is ambiguous, assume the most logical context and respond appropriately.
        
        Here is the input provided by the user:
        
        "$userInput"
        
        Provide only the body of the article as the output. Do not explain your actions or add any introductory text.
        * make the article in user language.
        EOT;
        
    
        // Call the AI API
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->post($url, [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => $prompt
                        ]
                    ]
                ]
            ]
        ]);
    
        // Check if the request was successful
        if ($response->successful()) {
            $result = $response->json(); // Extract the response from the API
    
            // Extract the text from the response
            $text = $result['candidates'][0]['content']['parts'][0]['text'];
    
            return response()->json([
                'output' => $text
            ]);
        }
    
        // Handle error
        return response()->json(['error' => 'Failed to process input'], 500);
    }
    
    
    
}

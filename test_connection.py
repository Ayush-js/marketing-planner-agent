from dotenv import load_dotenv
import os
from groq import Groq

# Load API key from .env file
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

# Send a simple test message
print("🔄 Testing Groq connection...")

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Say 'Connection successful! Ready to build the Marketing Planner Agent.' and nothing else."
        }
    ],
    model="llama-3.3-70b-versatile",
)

# Print the response
print("✅ Response:", chat_completion.choices[0].message.content)
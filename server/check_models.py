import google.generativeai as genai

genai.configure(api_key="AIzaSyAyiewR-zNy2DFo3bicS8xDy6EPBkj1dL8")

print("Listing available models...")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(m.name)
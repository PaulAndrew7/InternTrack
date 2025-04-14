import sys
from pypdf import PdfReader

def extract_text_from_pdf(pdf_path):
    try:
        # Create a PDF reader object
        pdf_reader = PdfReader(pdf_path)
        
        # Extract text from all pages
        text = ''
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_text.py <pdf_path>", file=sys.stderr)
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    text = extract_text_from_pdf(pdf_path)
    print(text) 
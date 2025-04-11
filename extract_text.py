import sys
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

# Set Tesseract OCR path (Modify if installed in a different location)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def extract_text_from_pdf(pdf_path):
    try:
        images = convert_from_path(pdf_path)
        extracted_text = ""

        for img in images:
            extracted_text += pytesseract.image_to_string(img, lang="eng") + "\n"

        return extracted_text.strip()
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    extracted_text = extract_text_from_pdf(pdf_path)
    print(extracted_text)

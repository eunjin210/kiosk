from PIL import Image
import os

# 원본 이미지 폴더
input_folder = 'input_images'
# 리사이즈된 이미지 저장 폴더
output_folder = 'resized_images'
# 고정할 세로(height) 크기
fixed_height = 200

# 출력 폴더가 없으면 생성
os.makedirs(output_folder, exist_ok=True)
categories = ["coffee", "dessert", "tea", "beverage"]

# 허용된 이미지 확장자
image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')

for filename in os.listdir(input_folder):
    if filename.lower().endswith(image_extensions):
        input_path = os.path.join(input_folder, filename)
        output_path = os.path.join(output_folder, filename)

        try:
            with Image.open(input_path) as img:
                original_width, original_height = img.size
                # 비율에 맞게 너비 계산
                new_width = int((fixed_height / original_height) * original_width)
                resized_img = img.resize((new_width, fixed_height), Image.ANTIALIAS)
                resized_img.save(output_path)
                print(f"✅ {filename} → ({new_width}x{fixed_height}) 리사이즈 완료")
        except Exception as e:
            print(f"❌ {filename} 처리 중 오류 발생: {e}")

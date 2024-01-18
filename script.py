import os
import json
from pymongo import MongoClient
from bson import ObjectId


# Thay thế thông tin đăng nhập của bạn vào dòng dưới đây
database_name = "ManageAdvertisingBoards" 

# Kết nối đến MongoDB
try:
    # Sử dụng thông tin đăng nhập để tạo URL kết nối
    connection_url = f"mongodb://localhost:27017"
    client = MongoClient(connection_url)
    db = client[database_name]
    print("Kết nối thành công đến MongoDB!")
except Exception as e:
    print(f"Kết nối đến MongoDB thất bại. Lỗi: {str(e)}")
    exit()

# Lấy đường dẫn tuyệt đối của thư mục hiện tại
current_directory = os.path.dirname(__file__)

# Đường dẫn đến thư mục chứa các file JSON (tuyệt đối)
json_folder_path = os.path.join(current_directory, 'data')

for json_file in os.listdir(json_folder_path):
    if json_file.endswith('.json'):
        # Tạo collection name từ tên file JSON
        collection_name = json_file[:-5]

        # Tạo collection con (nếu chưa tồn tại)
        child_collection = db[collection_name]

        # In thông báo để xem collection được tạo hay không
        print(f"Đang thao tác trên collection: {child_collection.name}")

        # Đọc file JSON và chèn dữ liệu
        with open(os.path.join(json_folder_path, json_file), 'r', encoding='utf-8') as file:
            data = json.load(file)

            # Xử lý trường '_id' để loại bỏ giá trị '$oid' không hợp lệ
            for document in data:
                if '_id' in document and '$oid' in document['_id']:
                    # Thay đổi giá trị '$oid' thành một ObjectId hợp lệ
                    document['_id'] = ObjectId(document['_id']['$oid'])

            if isinstance(data, list):
                # Dữ liệu là một danh sách các documents
                # Thêm dữ liệu vào MongoDB
                child_collection.insert_many(data)
            else:
                # Dữ liệu là một document duy nhất
                child_collection.insert_one(data)

print("Upload thành công.")

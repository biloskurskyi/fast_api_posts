# fast_api_posts   
Test task using FastAPI to manage posts and comments, featuring user authentication, content moderation, and analytics, with optional AI-driven auto-reply functionality.     
    
1. Реєстрація користувача   
http://127.0.0.1:8000/users/register (POST)   
Тіло запиту(json):   
{   
    "username": "string",      
    "password": "string",       
}     
     
2. Вхід користувача:    
Адреса: http://127.0.0.1:8000/users/login (POST)     
Тіло запиту(json):    
{    
    "username": "string",     
    "password": "string"      
}     
      
3. Створення поста      
Адреса: http://127.0.0.1:8000/posts/ (POST)         
Тіло запиту (json):    
{     
    "title": "string",           
    "content": "string"         
}     
    
4. Отримання поста за ID   
Адреса: http://127.0.0.1:8000/posts/{post_id} (GET)     
Де {post_id} - ID поста, який потрібно отримати.      
   
5. Отримання списку постів     
Адреса: http://127.0.0.1:8000/posts/ (GET)       
Параметри запиту:     
      
6. Оновлення поста       
Адреса: http://127.0.0.1:8000/posts/{post_id} (PUT)         
Тіло запиту (json):       
{       
    "title": "string",    
    "content": "string"     
}      
Де {post_id} - ID поста, який потрібно оновити.      
     
7. Видалення поста       
Адреса: http://127.0.0.1:8000/posts/{post_id} (DELETE)       
Де {post_id} - ID поста, який потрібно видалити.      
            
8. Отримання коментарів для поста         
Адреса: http://127.0.0.1:8000/posts/{post_id}/comments (GET)         
Де {post_id} - ID поста, для якого потрібно отримати коментарі.     
        
9. Створення коментаря     
Адреса: http://127.0.0.1:8000/comments/ (POST)     
Тіло запиту (json):     
{     
"info": "string",     
"post_id": "integer"     
}     
     
10. Отримання коментаря за ID     
Адреса: http://127.0.0.1:8000/comments/{comment_id} (GET)     
Де {comment_id} - ID коментаря, який потрібно отримати.     
     
11. Оновлення коментаря     
Адреса: http://127.0.0.1:8000/comments/{comment_id} (PUT)     
Тіло запиту (json):     
{     
"info": "string"     
}     
Де {comment_id} - ID коментаря, який потрібно оновити.     
     
12. Видалення коментаря     
Адреса: http://127.0.0.1:8000/comments/{comment_id} (DELETE)     
Де {comment_id} - ID коментаря, який потрібно видалити.      
           
13. Отримання щоденного аналізу коментарів           
Адреса: http://127.0.0.1:8000/comments/daily-breakdown?date_from=2023-01-01&date_to=2025-12-31 (GET)           
Параметри запиту:            
date_from: "YYYY-MM-DD" (дата початку періоду)          
date_to: "YYYY-MM-DD" (дата закінчення періоду)      
           

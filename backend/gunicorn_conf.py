# gunicorn.conf
# coding:utf-8
# ابدأ الأمر：gunicorn -c gunicorn.py application.asgi:application
import multiprocessing
# عدد عمليات العمل المتوازية, int，cpuكمية*2+1 رقم العملية الموصى به
workers = multiprocessing.cpu_count() * 2 + 1
# حدد عدد المواضيع التي تم فتحها في كل عملية
threads = 3
# ملزمipملزم
bind = '0.0.0.0:8000'
# اضبط عملية الوصي,امنح العملية إلى الإدارة الثالثة
daemon = 'false'
# وضع العمل coroutine，الافتراضي هوsyncنموذج,توصية gevent，استخدم هنا وuvicornيستخدم uvicorn.workers.UvicornWorker
worker_class = 'uvicorn.workers.UvicornWorker'
# حدد الحد الأقصى للمبلغ المتزامن（كلworkerعدد مؤشرات ترابط العمل للمعالجة，عدد صحيح إيجابي，تقصير1）
worker_connections = 10000
# 最大客户端并发كمية，بشكل افتراضي ، هذه القيمة1000。سيؤثر هذا الإعدادgeventوeventlet工作نموذج
# كل工作进程将يخرج处理max_requestsبعد الطلب ، أعد تشغيل العملية تلقائيًا
max_requests = 10000
max_requests_jitter = 200
# اضبط دليل ملف العملية
pidfile = './gunicorn.pid'
# مستوى اليوميات，这个مستوى اليوميات指ل是错误日志ل级别，لا يمكن تعيين مستوى سجل الوصول
loglevel = 'info'
# يثبتgunicornتفضل بزيارة تنسيق السجل，错误日志无法يثبت
access_log_format = '' # worker_class ل uvicorn.workers.UvicornWorker ساعة，日志格式لDjangoلloggers
# قائمة انتظار مراقبة
backlog = 512
#اسم العملية
proc_name = 'gunicorn_process'
# يثبت超ساعةساعة间120s，تقصير30s。按自己ل需求进行يثبتtimeout = 120
timeout = 120
# 超ساعة重启
graceful_timeout = 300
# يخرجkeep-alive连接上等待请求ل秒数，تحت الافتراضي值ل2。一般设定يخرج1~5بين الثاني。
keepalive = 3
# HTTP请求行ل最大大小，يتم استخدام هذه المعلمة للحدHTTP请求行ل允许大小，تحت الافتراضي，这个值ل4094。
# قيمة0~8190ل数字。هذه المعلمة يمكن أن تمنع أيDDOSهجوم
limit_request_line = 5120
# حدHTTP请求中请求头字段لكمية。
#  此字段用于حد请求头字段لكمية以防止DDOSهجوم，وlimit-request-field-sizeيمكن أن يؤدي الاستخدام معًا إلى تحسين الأمن。
# تحت الافتراضي，这个值ل100，لا يمكن تجاوز هذه القيمة32768
limit_request_fields = 101
# حدHTTP请求中请求头ل大小，بشكل افتراضي ، هذه القيمة8190。
# قيمة一个整数或者0，当该值ل0ساعة，表示将对请求头大小不做حد
limit_request_field_size = 0
# سجل الإخراج القياسي
accesslog = '-'

import urllib.request, json
data = json.dumps({'settingKey': 'role_permissions', 'settingValue': '[{"id":1,"name":"View Leads","manager":true,"salesperson":true},{"id":2,"name":"Assign Leads","manager":true,"salesperson":false},{"id":3,"name":"View Deals","manager":false,"salesperson":true},{"id":4,"name":"View Reports","manager":true,"salesperson":false},{"id":5,"name":"Manage Users","manager":false,"salesperson":false}]'})
req = urllib.request.Request('http://localhost:8080/api/settings/save', data=data.encode('utf-8'), headers={'Content-Type': 'application/json'}, method='POST')
try:
    print("Response:", urllib.request.urlopen(req).read().decode('utf-8'))
except Exception as e:
    print("Error:", e)

try:
    print("GET Response:", urllib.request.urlopen('http://localhost:8080/api/settings/get/role_permissions').read().decode('utf-8'))
except Exception as e:
    print("GET Error:", e)

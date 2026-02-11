from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
from datetime import datetime
import os

app = Flask(__name__)
# Enable CORS for all routes and origins to prevent preflight errors
CORS(app, resources={r"/api/*": {"origins": "*"}})

# EXTENDED DUMMY DATA STORE
# Initializing with more comprehensive dummy data
products = [
    {
        "id": "vm-basic",
        "name": "Virtual Machines",
        "category": "Compute",
        "description": "Provision Windows and Linux virtual machines in seconds",
        "basePrice": 50,
        "configurations": [
            {"name": "Operating System", "type": "select", "options": [{"label": "Linux", "value": "linux", "priceMultiplier": 1}, {"label": "Windows", "value": "windows", "priceMultiplier": 1.5}]},
            {"name": "Instance Configuration", "type": "select", "options": [{"label": "2 vCPU, 4 GB RAM", "value": "small", "priceMultiplier": 1}, {"label": "4 vCPU, 8 GB RAM", "value": "medium", "priceMultiplier": 2}, {"label": "8 vCPU, 16 GB RAM", "value": "large", "priceMultiplier": 4}]}
        ],
        "addons": [
            {"id": "backup", "name": "Daily Backup", "price": 10, "description": "Automated snapshots"},
            {"id": "monitoring", "name": "Advanced Monitoring", "price": 15, "description": "Detailed health checks"}
        ]
    },
    {
        "id": "db-postgres",
        "name": "PostgreSQL Database",
        "category": "Databases",
        "description": "Managed PostgreSQL database instance with high availability",
        "basePrice": 80,
        "configurations": [
            {"name": "Tier", "type": "select", "options": [{"label": "General Purpose", "value": "gp", "priceMultiplier": 1}, {"label": "Memory Optimized", "value": "mo", "priceMultiplier": 1.8}]}
        ],
        "addons": [{"id": "ha", "name": "High Availability", "price": 50, "description": "Multi-region failover"}]
    },
    {
        "id": "storage-blob",
        "name": "Blob Storage",
        "category": "Storage",
        "description": "Massively scalable object storage",
        "basePrice": 0.02,
        "configurations": [{"name": "Capacity (GB)", "type": "number", "min": 1, "max": 10000}],
        "addons": []
    }
]

users = [
    {"id": "u1", "name": "Sarah Admin", "email": "sarah@pricepoint.com", "role": "SALES_ADMIN", "createdAt": "2024-01-01T10:00:00"},
    {"id": "u2", "name": "Michael Manager", "email": "michael@pricepoint.com", "role": "SALES_MANAGER", "createdAt": "2024-01-05T12:30:00"},
    {"id": "u3", "name": "Alex Presales", "email": "alex@pricepoint.com", "role": "PRESALES", "createdAt": "2024-02-10T09:15:00"}
]

workflow_rules = [
    {"id": "w1", "name": "Global High Value Approval", "condition": "total_value", "threshold": 50000, "approver": "SALES_ADMIN"},
    {"id": "w2", "name": "Standard Discount Threshold", "condition": "discount_pct", "threshold": 15, "approver": "SALES_MANAGER"}
]

config_rules = [
    {"id": "cr1", "name": "Windows Monitoring Req", "productId": "vm-basic", "triggerConfig": "Operating System", "triggerValue": "windows", "restrictedConfig": "Advanced Monitoring", "action": "REQUIRE"}
]

quotes = [
    {
        "id": "QT-DEMO1",
        "customer": {"fullName": "John Doe", "organization": "Acme Corp", "email": "john@acme.com", "mobile": "1234567890"},
        "items": [],
        "totalEstimate": 1250.00,
        "status": "APPROVED",
        "createdAt": "2024-03-01T10:00:00",
        "createdBy": "PRESALES"
    }
]

# API ROUTES

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(products)

@app.route('/api/quotes', methods=['GET', 'POST'])
def manage_quotes():
    if request.method == 'GET':
        return jsonify(quotes)
    if request.method == 'POST':
        data = request.json
        new_quote = {
            "id": f"QT-{uuid.uuid4().hex[:5].upper()}",
            "customer": data['customer'],
            "items": data['items'],
            "totalEstimate": data['totalEstimate'],
            "status": "DRAFT",
            "createdAt": datetime.now().isoformat(),
            "createdBy": data['createdBy']
        }
        quotes.append(new_quote)
        return jsonify(new_quote), 201

@app.route('/api/quotes/<quote_id>', methods=['PUT'])
def update_quote(quote_id):
    data = request.json
    for q in quotes:
        if q['id'] == quote_id:
            q.update(data)
            return jsonify(q)
    return jsonify({"error": "Quote not found"}), 404

@app.route('/api/admin/rules', methods=['GET', 'POST'])
def manage_rules():
    if request.method == 'GET':
        return jsonify(workflow_rules)
    if request.method == 'POST':
        rule = request.json
        rule['id'] = str(uuid.uuid4())[:8]
        workflow_rules.append(rule)
        return jsonify(rule), 201

@app.route('/api/admin/config-rules', methods=['GET', 'POST'])
def manage_config_rules():
    if request.method == 'GET':
        return jsonify(config_rules)
    if request.method == 'POST':
        rule = request.json
        rule['id'] = str(uuid.uuid4())[:8]
        config_rules.append(rule)
        return jsonify(rule), 201

@app.route('/api/admin/users', methods=['GET', 'POST'])
def manage_users():
    if request.method == 'GET':
        return jsonify(users)
    if request.method == 'POST':
        user = request.json
        user['id'] = str(uuid.uuid4())[:8]
        user['createdAt'] = datetime.now().isoformat()
        users.append(user)
        return jsonify(user), 201

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    # Listen on all interfaces (0.0.0.0) for maximum accessibility
    app.run(debug=True, host='0.0.0.0', port=port)
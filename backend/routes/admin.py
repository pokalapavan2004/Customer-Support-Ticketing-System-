from flask import Blueprint, jsonify
from models import Ticket

admin_bp = Blueprint('admin_bp', __name__)

@admin_bp.route('/tickets', methods=['GET'])
def view_tickets():
    tickets = Ticket.query.all()
    ticket_list = [{
        "id": t.id,
        "title": t.title,
        "status": t.status,
        "priority": t.priority
    } for t in tickets]
    return jsonify(ticket_list)

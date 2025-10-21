from flask import Blueprint, request, jsonify, render_template
from flask_login import login_required, current_user
from models import db, Ticket, User

ticket_bp = Blueprint('tickets', __name__)

# Create a new ticket (User)
@ticket_bp.route('/create', methods=['POST'])
@login_required
def create_ticket():
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')
    priority = data.get('priority')

    if not all([title, description, category, priority]):
        return jsonify({"error": "All fields are required"}), 400

    new_ticket = Ticket(
        title=title,
        description=description,
        category=category,
        priority=priority,
        user_id=current_user.id
    )

    db.session.add(new_ticket)
    db.session.commit()
    return jsonify({"message": "Ticket created successfully!", "ticket_id": new_ticket.id}), 201



# Get all tickets (Admin) or user's tickets
@ticket_bp.route('/all', methods=['GET'])
@login_required
def get_tickets():
    if current_user.is_admin:
        tickets = Ticket.query.order_by(Ticket.created_at.desc()).all()
    else:
        tickets = Ticket.query.filter_by(user_id=current_user.id).order_by(Ticket.created_at.desc()).all()

    tickets_list = []
    for ticket in tickets:
        tickets_list.append({
            "id": ticket.id,
            "title": ticket.title,
            "description": ticket.description,
            "category": ticket.category,
            "priority": ticket.priority,
            "status": ticket.status,
            "assigned_agent": ticket.assigned_agent,
            "internal_notes": ticket.internal_notes,
            "created_at": ticket.created_at.strftime('%Y-%m-%d %H:%M'),
            "updated_at": ticket.updated_at.strftime('%Y-%m-%d %H:%M')
        })

    return jsonify({"tickets": tickets_list})
# Update a ticket (Admin only)
@ticket_bp.route('/update/<int:ticket_id>', methods=['PUT'])
@login_required
def update_ticket(ticket_id):
    data = request.get_json()
    ticket = Ticket.query.get(ticket_id)

    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404
    if current_user.is_admin:
        if 'title' in data:
            ticket.title = data['title']
        if 'description' in data:
            ticket.description = data['description']
        if 'category' in data:
            ticket.category = data['category']
        if 'priority' in data:
            ticket.priority = data['priority']
        if 'assigned_agent' in data:
            ticket.assigned_agent = data['assigned_agent']
        if 'internal_notes' in data:
            ticket.internal_notes = data['internal_notes']
        if 'status' in data:
            ticket.status = data['status']
    else:
        if ticket.user_id != current_user.id:
            return jsonify({"error": "Unauthorized - can only update your own tickets"}), 403
        if ticket.status == 'Closed':
            return jsonify({"error": "Cannot update a closed ticket"}), 400
        if 'title' in data:
            ticket.title = data['title']
        if 'description' in data:
            ticket.description = data['description']
        if 'category' in data:
            ticket.category = data['category']

    db.session.commit()
    return jsonify({"message": "Ticket updated successfully"}), 200



# Delete a ticket (Admin only)
@ticket_bp.route('/delete/<int:ticket_id>', methods=['DELETE'])
@login_required
def delete_ticket(ticket_id):
    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized action"}), 403

    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"error": "Ticket not found"}), 404

    db.session.delete(ticket)
    db.session.commit()
    return jsonify({"message": "Ticket deleted successfully"}), 200



# Analytics endpoints and pages
@ticket_bp.route('/stats')
@login_required
def ticket_stats():
    if current_user.is_admin:
        total = Ticket.query.count()
        open_count = Ticket.query.filter_by(status='Open').count()
        in_progress = Ticket.query.filter_by(status='In Progress').count()
        resolved = Ticket.query.filter_by(status='Resolved').count()
        closed = Ticket.query.filter_by(status='Closed').count()
    else:
        total = Ticket.query.filter_by(user_id=current_user.id).count()
        open_count = Ticket.query.filter_by(user_id=current_user.id, status='Open').count()
        in_progress = Ticket.query.filter_by(user_id=current_user.id, status='In Progress').count()
        resolved = Ticket.query.filter_by(user_id=current_user.id, status='Resolved').count()
        closed = Ticket.query.filter_by(user_id=current_user.id, status='Closed').count()

    return jsonify({
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved,
        "closed": closed
    })


@ticket_bp.route('/analytics')
@login_required
def analytics_user():
    return render_template('analytics_user.html')


@ticket_bp.route('/admin/analytics')
@login_required
def analytics_admin():
    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403
    return render_template('analytics_admin.html')

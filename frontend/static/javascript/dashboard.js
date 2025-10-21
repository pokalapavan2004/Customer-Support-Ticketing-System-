document.addEventListener('DOMContentLoaded', () => {
//   dom elements script
    const ticketModal = document.getElementById('ticketModal');
    const newTicketBtn = document.getElementById('newTicketBtn');
    const modalClose = document.getElementById('modalClose');
    const modalCancel = document.getElementById('modalCancel');
    const ticketForm = document.getElementById('ticketForm');
    const searchBox = document.getElementById('searchBox');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const dateFilter = document.getElementById('dateFilter');
    const sortBy = document.getElementById('sortBy');
    const profileModal = document.getElementById('profileModal');
    const profileBtn = document.getElementById('profileBtn');
    const profileModalClose = document.getElementById('profileModalClose');
    const profileModalCancel = document.getElementById('profileModalCancel');
    const profileForm = document.getElementById('profileForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const adminFields = document.getElementById('adminFields');

    // state management script
    let lastTicketState = new Map();
    let isUserDashboard = window.location.pathname.includes('/user/dashboard');
    let isAdminDashboard = window.location.pathname.includes('/admin/dashboard');

//    notification system script
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
            max-width: 350px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    //  CSS animations script
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
        .ticket-card.updated {
            animation: highlight 1.5s ease-out;
        }
        @keyframes highlight {
            0%, 100% { background-color: inherit; }
            50% { background-color: #fef3c7; box-shadow: 0 0 0 3px #fbbf24; }
        }
    `;
    document.head.appendChild(style);

    // script for auto refresh in the user dashboard 
    function refreshUserTickets(silent = false) {
        if (!silent) {
            console.log(' Refreshing tickets...');
        }
        
        fetch('/tickets/all', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.tickets) {
                updateTicketDisplay(data.tickets, silent);
            }
        })
        .catch(error => {
            console.error(' Error refreshing tickets:', error);
            if (!silent) {
                showNotification('Failed to refresh tickets', 'error');
            }
        });
    }

    function updateTicketDisplay(tickets, silent = false) {
        const ticketsSection = document.querySelector('.ticketssection');
        if (!ticketsSection) return;
        
        // Track changes script  
        let hasChanges = false;
        let changedTickets = [];
        const newTicketState = new Map();
        
        tickets.forEach(ticket => {
            const ticketState = {
                status: ticket.status,
                priority: ticket.priority,
                assigned_agent: ticket.assigned_agent || '',
                internal_notes: ticket.internal_notes || '',
                title: ticket.title,
                description: ticket.description
            };
            newTicketState.set(ticket.id, ticketState);
            
            // Check if ticket changed (only if we have previous state)
            if (lastTicketState.size > 0 && lastTicketState.has(ticket.id)) {
                const oldState = lastTicketState.get(ticket.id);
                if (oldState.status !== ticketState.status ||
                    oldState.priority !== ticketState.priority ||
                    oldState.assigned_agent !== ticketState.assigned_agent ||
                    oldState.internal_notes !== ticketState.internal_notes) {
                    hasChanges = true;
                    changedTickets.push(ticket.id);
                }
            }
        });
        
        // Update stored state
        lastTicketState = newTicketState;
        
        if (tickets.length === 0) {
            ticketsSection.innerHTML = '<p class="no-tickets">No tickets found. Click "+ New Ticket" to create one.</p>';
            return;
        }
        
        // Show notification only if there are actual changes and not initial load
        if (hasChanges && !silent) {
            showNotification(` ${changedTickets.length} ticket(s) updated!`, 'success');
        }
        
        // Clear and rebuild script 
        ticketsSection.innerHTML = '';
        
        tickets.forEach(ticket => {
            const ticketCard = document.createElement('div');
            ticketCard.className = 'ticketcard';
            if (changedTickets.includes(ticket.id)) {
                ticketCard.classList.add('updated');
            }
            ticketCard.id = `ticket-${ticket.id}`;
            ticketCard.setAttribute('data-created', ticket.created_at.split(' ')[0]);
            ticketCard.setAttribute('data-priority', ticket.priority);
            ticketCard.setAttribute('data-status', ticket.status);
            
            const statusClass = ticket.status.toLowerCase().replace(/ /g, '-');
            
            ticketCard.innerHTML = `
                <div class="ticketheader">
                    <h3>${ticket.title}</h3>
                    <span class="status ${statusClass}">
                        ${ticket.status}
                    </span>
                </div>
                <p style="margin:0;color:#6b7280;font-size:12px;">Created: ${ticket.created_at}</p>
                <p class="ticketdesc">${ticket.description}</p>
                <p><strong>Category:</strong> ${ticket.category}</p>
                <p><strong>Priority:</strong> ${ticket.priority}</p>
                <p><strong>Status:</strong> ${ticket.status}</p>
                <p><strong>Assigned Agent:</strong> ${ticket.assigned_agent || 'Not Assigned'}</p>
                <p><strong>Internal Notes:</strong> ${ticket.internal_notes || 'N/A'}</p>
            `;
            
            ticketsSection.appendChild(ticketCard);
        });
        
        // Reapply filters after updating display
        applyFilters();
    }

    // model management script
    const closeModal = () => { 
        if (ticketModal) {
            ticketModal.classList.add('hidden'); 
            document.body.classList.remove('modal-open');
        }
    };
    
    const openModal = (mode = 'create') => {
        if (!ticketForm) return;
        
        ticketForm.reset();
        document.getElementById('ticketId').value = '';
        
        if (mode === 'create') {
            modalTitle.textContent = 'Create New Ticket';
            submitBtn.textContent = 'Create';
            if (adminFields) adminFields.style.display = 'none';
        } else {
            modalTitle.textContent = 'Update Ticket';
            submitBtn.textContent = 'Save Changes';
            if (adminFields) adminFields.style.display = 'none';
        }
        
        if (ticketModal) {
            ticketModal.classList.remove('hidden');
            document.body.classList.add('modal-open');
        }
    };

    const closeProfileModal = () => profileModal?.classList.add('hidden');
    const openProfileModal = () => profileModal?.classList.remove('hidden');

    //event listeners script
    if (newTicketBtn) newTicketBtn.addEventListener('click', () => openModal('create'));
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === ticketModal) closeModal(); });

    if (profileBtn) profileBtn.addEventListener('click', openProfileModal);
    if (profileModalClose) profileModalClose.addEventListener('click', closeProfileModal);
    if (profileModalCancel) profileModalCancel.addEventListener('click', closeProfileModal);
    window.addEventListener('click', e => { if (e.target === profileModal) closeProfileModal(); });

    //ticket form submission script
    if (ticketForm) {
        ticketForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const ticketId = document.getElementById('ticketId').value;
            const data = {
                title: document.getElementById('ticketTitle').value.trim(),
                description: document.getElementById('ticketDescription').value.trim(),
                category: document.getElementById('ticketCategory').value.trim(),
                priority: document.getElementById('ticketPriority').value
            };

            if (!data.title || !data.description || !data.category) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }

            try {
                let url, method;
                if (ticketId) {
                    url = `/tickets/update/${ticketId}`;
                    method = 'PUT';
                } else {
                    url = '/tickets/create';
                    method = 'POST';
                }

                const response = await fetch(url, {
                    method: method,
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showNotification(result.message || 'Ticket saved successfully!', 'success');
                    closeModal();
                    
                    // Refresh based on dashboard type
                    if (isUserDashboard) {
                        setTimeout(() => refreshUserTickets(false), 500);
                    } else {
                        window.location.reload();
                    }
                } else {
                    showNotification(result.error || 'Failed to save ticket!', 'error');
                }
            } catch (err) {
                console.error(' Error:', err);
                showNotification('Failed to save ticket!', 'error');
            }
        });
    }

    //profile from submission script
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
                name: document.getElementById('profileName').value.trim()
            };

            if (!data.name || data.name.length < 2) {
                showNotification('Name must be at least 2 characters', 'error');
                return;
            }

            try {
                const response = await fetch('/auth/update-profile', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    showNotification('Profile updated successfully!', 'success');
                    closeProfileModal();
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    showNotification(result.error || 'Failed to update profile!', 'error');
                }
            } catch (err) {
                console.error(' Error:', err);
                showNotification('Failed to update profile!', 'error');
            }
        });
    }

    //filtering and search 
    const priorityRank = (p) => (p === 'High' ? 3 : p === 'Medium' ? 2 : p === 'Low' ? 1 : 0);
    
    const applyFilters = () => {
        const searchFilter = searchBox?.value.toLowerCase() || '';
        const statusFilterValue = statusFilter?.value || '';
        const priorityFilterValue = priorityFilter?.value || '';
        const dateFilterValue = dateFilter?.value || '';

        const cards = Array.from(document.querySelectorAll('.ticketcard'));
        
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            const status = (card.dataset.status || '').toLowerCase();
            const priority = card.dataset.priority || '';
            const createdDate = card.dataset.created || '';

            let show = true;

            if (searchFilter && !text.includes(searchFilter)) show = false;
            if (statusFilterValue && !status.includes(statusFilterValue.toLowerCase())) show = false;
            if (priorityFilterValue && !priority.includes(priorityFilterValue)) show = false;
            if (dateFilterValue && createdDate !== dateFilterValue) show = false;

            card.style.display = show ? '' : 'none';
        });

        // Sorting
        const container = document.querySelector('.ticketssection');
        if (!container || !sortBy) return;

        const visibleCards = cards.filter(c => c.style.display !== 'none');
        visibleCards.sort((a, b) => {
            const aPri = priorityRank(a.dataset.priority);
            const bPri = priorityRank(b.dataset.priority);
            const aStatus = (a.dataset.status || '').toLowerCase();
            const bStatus = (b.dataset.status || '').toLowerCase();

            switch (sortBy?.value) {
                case 'priority_asc': return aPri - bPri;
                case 'priority_desc': return bPri - aPri;
                case 'status_asc': return aStatus.localeCompare(bStatus);
                case 'status_desc': return bStatus.localeCompare(aStatus);
                default: return 0;
            }
        });

        visibleCards.forEach(card => container.appendChild(card));
    };

    if (searchBox) searchBox.addEventListener('input', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (priorityFilter) priorityFilter.addEventListener('change', applyFilters);
    if (dateFilter) dateFilter.addEventListener('change', applyFilters);
    if (sortBy) sortBy.addEventListener('change', applyFilters);

    // admin ticket update script 
    document.querySelectorAll('.update-ticket-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const ticketId = btn.dataset.id;
            const ticketCard = document.getElementById(`ticket-${ticketId}`);

            if (!ticketCard) {
                showNotification('Ticket not found!', 'error');
                return;
            }

            const title = ticketCard.querySelector('h3').textContent.trim();
            const description = ticketCard.querySelector('.ticketdesc').textContent.trim();
            
            // Get category from the paragraph
            const categoryParagraph = Array.from(ticketCard.querySelectorAll('p'))
                .find(p => p.textContent.includes('Category:'));
            const category = categoryParagraph ? 
                categoryParagraph.textContent.replace('Category:', '').trim() : '';
            
            const statusSelect = ticketCard.querySelector(`#status-${ticketId}`);
            const prioritySelect = ticketCard.querySelector(`#priority-${ticketId}`);
            const agentInput = ticketCard.querySelector(`#agent-${ticketId}`);
            const notesTextarea = ticketCard.querySelector(`#notes-${ticketId}`);

            if (!statusSelect || !prioritySelect || !agentInput || !notesTextarea) {
                showNotification('Cannot find ticket fields!', 'error');
                return;
            }

            const updatedData = {
                title,
                description,
                category,
                priority: prioritySelect.value,
                assigned_agent: agentInput.value.trim(),
                internal_notes: notesTextarea.value.trim(),
                status: statusSelect.value
            };

            // Disable button during update
            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';

            try {
                const response = await fetch(`/tickets/update/${ticketId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedData)
                });

                const result = await response.json();
                
                if (response.ok) {
                    showNotification(' Ticket updated successfully!', 'success');
                    btn.textContent = ' Saved';
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.disabled = false;
                    }, 2000);
                } else {
                    showNotification(result.error || 'Failed to update ticket', 'error');
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                console.error(' Error:', err);
                showNotification('Error updating ticket', 'error');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    });

    // ticket deleting
    document.querySelectorAll('.delete-ticket-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            if (!confirm(' Are you sure you want to delete this ticket? This action cannot be undone.')) return;

            btn.disabled = true;
            const originalText = btn.textContent;
            btn.textContent = 'Deleting...';

            try {
                const response = await fetch(`/tickets/delete/${id}`, { method: 'DELETE' });
                const result = await response.json();
                
                if (response.ok) {
                    showNotification('Ticket deleted successfully!', 'success');
                    // Remove the ticket card with animation
                    const ticketCard = document.getElementById(`ticket-${id}`);
                    if (ticketCard) {
                        ticketCard.style.animation = 'slideOut 0.3s ease-out';
                        setTimeout(() => ticketCard.remove(), 300);
                    }
                } else {
                    showNotification(result.error || 'Failed to delete ticket!', 'error');
                    btn.textContent = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                console.error(' Error:', err);
                showNotification('Failed to delete ticket!', 'error');
                btn.textContent = originalText;
                btn.disabled = false;
            }
        });
    });

    // auto refresh 
    if (isUserDashboard) {
        console.log(' User dashboard detected - enabling auto-refresh');
        
        // Initial load of ticket states (silent) after 2 seconds
        setTimeout(() => refreshUserTickets(true), 2000);
        
        // Auto-refresh every 30 seconds
        const refreshInterval = setInterval(() => refreshUserTickets(true), 30000);
        
        // Add manual refresh button
        const topActions = document.querySelector('.topactions');
        if (topActions && !document.getElementById('refreshBtn')) {
            const refreshBtn = document.createElement('button');
            refreshBtn.innerHTML = '↻ Refresh';
            refreshBtn.className = 'btn-secondary';
            refreshBtn.style.marginLeft = '10px';
            refreshBtn.id = 'refreshBtn';
            
            refreshBtn.onclick = function() {
                refreshBtn.innerHTML = '⟳ Refreshing...';
                refreshBtn.disabled = true;
                
                refreshUserTickets(false);
                
                setTimeout(() => {
                    refreshBtn.innerHTML = '✓ Refreshed';
                    setTimeout(() => {
                        refreshBtn.innerHTML = '↻ Refresh';
                        refreshBtn.disabled = false;
                    }, 1000);
                }, 500);
            };
            
            topActions.appendChild(refreshBtn);
        }

        // Clear interval when page unloads
        window.addEventListener('beforeunload', () => {
            clearInterval(refreshInterval);
        });
    }

    // Initial filter application
    applyFilters();
    
    console.log(' Dashboard initialized successfully');
});

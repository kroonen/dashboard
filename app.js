const app = (function() {
    let dashboardCount = 3;

    // Utility functions
    const utils = {
        saveData: function() {
            try {
                const data = {
                    tasks: Array.from(document.querySelectorAll('#task-list li span')).map(span => span.textContent),
                    notes: document.getElementById('note-content').innerHTML,
                    events: Array.from(document.querySelectorAll('#event-list li span')).map(span => span.textContent),
                    wallpaper: document.body.style.backgroundImage,
                    kanban: this.getKanbanData(),
                    layout: this.getLayout(),
                    cards: this.getCards(),
                    tabs: this.getTabs(),
                    activeTab: $('.tab.active').index(),
                    dashboardCount: dashboardCount
                };
                const serializedData = JSON.stringify(data);
                localStorage.setItem('productivityData', serializedData);
                console.log('Data saved successfully:', data);
            } catch (error) {
                console.error('Error saving data:', error);
            }
        },

        loadData: function() {
            try {
                const serializedData = localStorage.getItem('productivityData');
                if (serializedData) {
                    const data = JSON.parse(serializedData);
                    console.log('Data loaded successfully:', data);
                    this.loadTasks(data.tasks || []);
                    this.loadNotes(data.notes || '');
                    this.loadEvents(data.events || []);
                    this.loadWallpaper(data.wallpaper || '');
                    this.loadKanban(data.kanban || {});
                    this.loadCards(data.cards || []);
                    this.loadLayout(data.layout || {}); // Move this after loadCards
                    this.loadTabs(data.tabs || []);
                    this.loadActiveTab(data.activeTab || 0);
                    dashboardCount = data.dashboardCount || 3;
                } else {
                    console.log('No data found in local storage');
                }
            } catch (error) {
                console.error('Error loading data:', error);
            }
        },

        getKanbanData: function() {
            const kanbanData = {};
            $('.kanban-column').each(function() {
                const columnId = $(this).attr('id');
                kanbanData[columnId] = Array.from($(this).find('.kanban-card')).map(card => card.textContent.replace('×', '').trim());
            });
            return kanbanData;
        },

		getLayout: function() {
			const layout = {};
			$('.card').each(function() {
				const id = $(this).attr('id');
				layout[id] = {
					width: $(this).width(),
					height: $(this).height(),
					top: $(this).position().top,
					left: $(this).position().left,
					content: $(this).find('.markdown-editor').html()
				};
			});
			return layout;
		},

        loadLayout: function(layout) {
            if (layout) {
                Object.entries(layout).forEach(([id, position]) => {
                    let card = $(`#${id}`);
                    if (!card.length) {
                        // If the card doesn't exist, create it
                        card = $(`<div id="${id}" class="card">
                            <div class="card-header"><h2>New Card</h2></div>
                            <div contenteditable="true" class="markdown-editor"></div>
                        </div>`);
                        $('#dashboard-0').append(card);
                    }
                    card.css({
                        width: position.width,
                        height: position.height,
                        top: position.top,
                        left: position.left
                    });
                    card.find('.markdown-editor').html(position.content);
                    
                    // Initialize draggable and resizable for the card
                    card.draggable({
                        handle: ".card-header",
                        containment: ".container",
                        stop: function(event, ui) {
                            utils.saveData();
                        }
                    }).resizable({
                        minHeight: 200,
                        minWidth: 200,
                        containment: ".container",
                        stop: function(event, ui) {
                            utils.saveData();
                        }
                    });
                    
                    card.find('.markdown-editor').on('input', function() {
                        utils.saveData();
                    });
                });
            }
        },

        getCards: function() {
            return Array.from(document.querySelectorAll('.card:not(#tasks):not(#notes):not(#calendar)')).map(card => ({
                id: card.id,
                content: card.querySelector('.markdown-editor').innerHTML
            }));
        },

        getTabs: function() {
            return Array.from(document.querySelectorAll('.tab')).map((tab, index) => ({
                title: tab.textContent,
                index: index,
                isDefault: index < 3 // Mark the first three tabs as default
            }));
        },

        loadTabs: function(tabs) {
            console.log('Loading tabs:', tabs);
            if (tabs && tabs.length) {
                // Clear existing tabs except the first three (Dashboard 1, Kanban, and Settings)
                $('.tab:gt(2)').remove();
                $('.dashboard:gt(2)').remove();

                // Add saved tabs
                tabs.forEach((tab, index) => {
                    if (!tab.isDefault) {  // Only add non-default tabs
                        $(".tabs").children().last().before(`<div class="tab" onclick="app.switchTab(${index})">${tab.title}</div>`);
                        $(".container").append(`<div id="dashboard-${index}" class="dashboard"></div>`);
                    }
                });

                dashboardCount = Math.max(3, tabs.length);
            }
            console.log('Tabs loaded, dashboardCount:', dashboardCount);
        },

        loadTasks: function(tasks) {
            document.getElementById('task-list').innerHTML = tasks.map(task => `
                <li>
                    <span contenteditable="true">${task}</span>
                    <button class="remove-btn" onclick="app.removeItem(this)">×</button>
                </li>
            `).join('');
        },

        loadNotes: function(notes) {
            document.getElementById('note-content').innerHTML = notes;
        },

        loadEvents: function(events) {
            document.getElementById('event-list').innerHTML = events.map(event => `
                <li>
                    <span contenteditable="true">${event}</span>
                    <button class="remove-btn" onclick="app.removeItem(this)">×</button>
                </li>
            `).join('');
        },

        loadWallpaper: function(wallpaper) {
            if (wallpaper) {
                document.body.style.backgroundImage = wallpaper;
            }
        },

        loadKanban: function(kanban) {
            if (kanban) {
                Object.entries(kanban).forEach(([columnId, tasks]) => {
                    const column = $(`#${columnId} .kanban-cards`).empty();
                    tasks.forEach(task => {
                        const card = $('<div class="kanban-card"></div>').text(task);
                        const deleteBtn = $('<span class="delete-card">×</span>').click(function() {
                            $(this).parent().remove();
                            utils.saveData();
                        });
                        card.append(deleteBtn);
                        column.append(card);
                    });
                });
            }
        },

        loadLayout: function(layout) {
            if (layout) {
                Object.entries(layout).forEach(([id, position]) => {
                    const card = $(`#${id}`);
                    if (card.length) {
                        card.css({
                            width: position.width,
                            height: position.height,
                            top: position.top,
                            left: position.left
                        });
                    }
                });
            }
        },

        loadCards: function(cards) {
            if (cards) {
                cards.forEach(card => {
                    dashboard.addNewCard(card.id, card.content);
                });
            }
        },

        loadActiveTab: function(activeTabIndex) {
            if (activeTabIndex !== undefined) {
                app.switchTab(activeTabIndex);
            }
        }
    };

    // Dashboard functions
    const dashboard = {
        init: function() {
            this.initDraggableResizable();
            this.initTaskEvents();
            this.initNoteEvents();
            this.initCalendarEvents();
            this.initKeyboardShortcuts();
        },

        initDraggableResizable: function() {
            $(".card").draggable({
                handle: ".card-header",
                containment: ".container",
                stop: function(event, ui) {
                    utils.saveData();
                }
            }).resizable({
                minHeight: 200,
                minWidth: 200,
                containment: ".container",
                stop: function(event, ui) {
                    utils.saveData();
                }
            });
        },

        initTaskEvents: function() {
            $('#new-task').on('keypress', function(e) {
                if (e.which === 13) {
                    dashboard.addTask();
                }
            });
            $('#task-list').on('input', 'span[contenteditable]', utils.saveData);
        },

        initNoteEvents: function() {
            $('#note-content').on('input', function() {
                utils.saveData();
            });
        },

        initCalendarEvents: function() {
            $('#new-event').on('keypress', function(e) {
                if (e.which === 13) {
                    dashboard.addEvent();
                }
            });
            $('#event-list').on('input', 'span[contenteditable]', utils.saveData);
        },

        initKeyboardShortcuts: function() {
            $(document).on('keydown', function(e) {
                if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                    e.preventDefault();
                    utils.saveData();
                    console.log('Data saved manually');
                }
            });
        },

        addTask: function() {
            const taskInput = document.getElementById('new-task');
            const taskList = document.getElementById('task-list');
            if (taskInput.value.trim() !== '') {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span contenteditable="true">${taskInput.value}</span>
                    <button class="remove-btn" onclick="app.removeItem(this)">×</button>
                `;
                taskList.appendChild(li);
                taskInput.value = '';
                utils.saveData();
            }
        },

        addEvent: function() {
            const eventInput = document.getElementById('new-event');
            const eventList = document.getElementById('event-list');
            if (eventInput.value.trim() !== '') {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span contenteditable="true">${eventInput.value}</span>
                    <button class="remove-btn" onclick="app.removeItem(this)">×</button>
                `;
                eventList.appendChild(li);
                eventInput.value = '';
                utils.saveData();
            }
        },

        removeItem: function(button) {
            button.parentElement.remove();
            utils.saveData();
        },

        addNewCard: function(id = null, content = '') {
            const cardId = id || 'card-' + Date.now();
            const newCard = $(`<div id="${cardId}" class="card" style="width: 300px; height: 400px; top: 100px; left: 50px;">
                <div class="card-header"><h2>New Card</h2></div>
                <div contenteditable="true" class="markdown-editor">${content}</div>
            </div>`);
            $('#dashboard-0').append(newCard);
            
            // Initialize draggable and resizable for the new card
            newCard.draggable({
                handle: ".card-header",
                containment: ".container",
                stop: function(event, ui) {
                    utils.saveData();
                }
            }).resizable({
                minHeight: 200,
                minWidth: 200,
                containment: ".container",
                stop: function(event, ui) {
                    utils.saveData();
                }
            });
            
            newCard.find('.markdown-editor').on('input', function() {
                utils.saveData();
            });
            utils.saveData();
        }
    };

    // Kanban functions
    const kanban = {
        init: function() {
            this.initSortable();
            this.initInputEvents();
        },

        initSortable: function() {
            $(".kanban-cards").sortable({
                connectWith: ".kanban-cards",
                placeholder: "kanban-card-placeholder",
                cursor: "move",
                start: function(event, ui) {
                    ui.placeholder.height(ui.item.height());
                    ui.item.addClass('dragging');
                },
                stop: function(event, ui) {
                    ui.item.removeClass('dragging');
                    utils.saveData();
                }
            }).disableSelection();

            // Make empty columns droppable
            $(".kanban-column").droppable({
                accept: ".kanban-card",
                hoverClass: "kanban-column-hover",
                drop: function(event, ui) {
                    const columnCards = $(this).find('.kanban-cards');
                    ui.draggable.detach().appendTo(columnCards);
                    utils.saveData();
                }
            });
        },

        initInputEvents: function() {
            $('.kanban-column input').off('keypress').on('keypress', function(e) {
                if (e.which === 13) {
                    kanban.addTask(this, $(this).closest('.kanban-column').attr('id'));
                }
            });
        },

        addTask: function(input, columnId) {
            if (input.value.trim() !== '') {
                const card = $('<div class="kanban-card"></div>').text(input.value);
                const deleteBtn = $('<span class="delete-card">×</span>').click(function(e) {
                    e.stopPropagation();
                    $(this).parent().remove();
                    utils.saveData();
                });
                card.append(deleteBtn);
                $(`#${columnId} .kanban-cards`).append(card);
                input.value = '';
                utils.saveData();
            }
        }
    };

    // Settings functions
    const settings = {
        init: function() {
            $('#change-wallpaper-btn').click(() => $('#wallpaper-input').click());
            $('#wallpaper-input').change(this.changeWallpaper);
            $('#export-data-btn').click(this.exportData);
            $('#import-data-btn').click(() => $('#import-input').click());
            $('#import-input').change(this.importData);
            $('#reset-data-btn').click(this.resetData);
        },

        changeWallpaper: function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.body.style.backgroundImage = `url('${e.target.result}')`;
                    utils.saveData();
                }
                reader.readAsDataURL(file);
            }
        },

        exportData: function() {
            const data = JSON.parse(localStorage.getItem('productivityData'));
            const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'productivity_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        importData: function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        localStorage.setItem('productivityData', JSON.stringify(data));
                        utils.loadData();
                        alert('Data imported successfully!');
                    } catch (error) {
                        alert('Error importing data. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        },

        resetData: function() {
            if (confirm("Are you sure you want to reset all data? This action cannot be undone.")) {
                localStorage.removeItem('productivityData');
                location.reload();
            }
        }
    };

    // Public methods
    return {
        init: function() {
            console.log('Initializing app...');
            utils.loadData();
            dashboard.init();
            kanban.init();
            settings.init();

            // Auto-save every 30 seconds
            setInterval(utils.saveData, 30000);
            console.log('App initialized');
        },

        switchTab: function(index) {
            $(".tab").removeClass("active");
            $(".tab").eq(index).addClass("active");
            $(".dashboard").removeClass("active");
            $(`#dashboard-${index}`).addClass("active");
            utils.saveData();
        },

        addNewTab: function() {
            const newTabIndex = dashboardCount;
            $(".tabs").children().last().before(`<div class="tab" onclick="app.switchTab(${newTabIndex})">Dashboard ${newTabIndex + 1}</div>`);
            $(".container").append(`<div id="dashboard-${newTabIndex}" class="dashboard"></div>`);
            dashboardCount++;
            this.switchTab(newTabIndex);
            utils.saveData();
            console.log('New tab added, dashboardCount:', dashboardCount);
        },

        removeItem: function(button) {
            button.parentElement.remove();
            utils.saveData();
        },

        addNewCard: function(id = null, content = '') {
            const cardId = id || 'card-' + Date.now();
            const newCard = $(`<div id="${cardId}" class="card" style="width: 300px; height: 400px; top: 100px; left: 50px;">
                <div class="card-header"><h2>New Card</h2></div>
                <div contenteditable="true" class="markdown-editor">${content}</div>
            </div>`);
            $('#dashboard-0').append(newCard);
            
            // Initialize draggable and resizable for the new card
            newCard.draggable({
                handle: ".card-header",
                containment: ".container",
                stop: function(event, ui) {
                    utils.saveData();
                }
            }).resizable({
                minHeight: 200,
                minWidth: 200,
                containment: ".container",
                stop: function(event, ui) {
                    utils.saveData();
                }
            });
            
            newCard.find('.markdown-editor').on('input', function() {
                utils.saveData();
            });
            utils.saveData();
        }
    };
})();

// Initialize the app when the document is ready
$(document).ready(function() {
    app.init();
});

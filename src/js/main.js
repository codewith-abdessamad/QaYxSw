function toggleDarkMode() {
    document.body.classList.toggle('dark');
}

// Handle active menu items but exclude the logo
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const logo = document.querySelector('.nav-section-top .nav-item:first-child');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Skip if clicking on the logo
            if (this === logo) {
                return;
            }
            
            // Remove active class from all items
            navItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });

    // Initialize accounts page if we're on it
    initializeAccountsPage();
});

// Accounts page functionality
function initializeAccountsPage() {
    if (!document.querySelector('.tab-button')) return; // Only run on accounts page

    // Username dropdown functionality
    const userButton = document.querySelector('.user-button');
    const dropdownList = document.querySelector('.dropdown-list');

    userButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        dropdownList.classList.toggle('hidden');
    });

    // Sort dropdown functionality
    const sortButton = document.querySelector('.sort-button');
    const sortDropdown = document.querySelector('.sort-dropdown');

    sortButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        sortDropdown.classList.toggle('hidden');
    });

    // Filter dropdown functionality
    const filterButton = document.querySelector('.filter-button');
    const filterDropdown = document.querySelector('.filter-dropdown');

    filterButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        filterDropdown.classList.toggle('hidden');
    });

    // Global click handler to close dropdowns
    document.addEventListener('click', function(event) {
        if (!userButton.contains(event.target) && !dropdownList.contains(event.target)) {
            dropdownList.classList.add('hidden');
        }
        if (!sortButton.contains(event.target) && !sortDropdown.contains(event.target)) {
            sortDropdown.classList.add('hidden');
        }
        if (!filterButton.contains(event.target) && !filterDropdown.contains(event.target)) {
            filterDropdown.classList.add('hidden');
        }
    });

    // Checkbox functionality
    const mainCheckbox = document.querySelector('thead input[type="checkbox"]');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    
    mainCheckbox.addEventListener('change', () => {
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = mainCheckbox.checked;
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const name = row.querySelector('td:first-child').textContent.toLowerCase();
            const username = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
            const role = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
            
            const matches = name.includes(searchTerm) || 
                          username.includes(searchTerm) || 
                          role.includes(searchTerm);
                          
            row.style.display = matches ? '' : 'none';
        });
    });

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const newButton = document.getElementById('newButton');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleTabSwitch(button);
        });
    });

    // Add initial attachment of filter listeners
    attachFilterListeners();
    attachSortListeners();
}

function handleTabSwitch(button) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const searchInput = document.getElementById('searchInput');
    const newButton = document.getElementById('newButton');
    const usersTable = document.querySelector('.overflow-x-auto:not(#groupsTable)');
    const groupsTable = document.getElementById('groupsTable');
    const sortDropdown = document.querySelector('.sort-dropdown');
    const filterDropdown = document.querySelector('.filter-dropdown');

    // Remove active state from all tabs
    tabButtons.forEach(btn => {
        btn.classList.remove('bg-gray-100', 'text-gray-900');
        btn.classList.add('text-gray-500');
    });
    
    // Add active state to clicked tab
    button.classList.remove('text-gray-500');
    button.classList.add('bg-gray-100', 'text-gray-900');

    const tabType = button.dataset.tab;
    
    if (tabType === 'users') {
        searchInput.placeholder = 'Search users...';
        newButton.setAttribute('title', 'New User');
        usersTable.classList.remove('hidden');
        groupsTable.classList.add('hidden');
        updateDropdownsForUsers(sortDropdown, filterDropdown);
    } else {
        searchInput.placeholder = 'Search groups...';
        newButton.setAttribute('title', 'New Group');
        usersTable.classList.add('hidden');
        groupsTable.classList.remove('hidden');
        updateDropdownsForGroups(sortDropdown, filterDropdown);
    }

    // Attach both sort and filter listeners
    attachSortListeners();
    attachFilterListeners();
}

function updateDropdownsForUsers(sortDropdown, filterDropdown) {
    sortDropdown.innerHTML = `
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="name-asc">Name (A to Z)</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="name-desc">Name (Z to A)</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="login">Last Login</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="role">Role</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="status">Status</div>
    `;

    filterDropdown.innerHTML = `
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="type" data-value="service">Service Accounts</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="type" data-value="system">System Users</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="type" data-value="user">Regular Users</div>
        <div class="border-t border-gray-100"></div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="status" data-value="active">Active</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="status" data-value="inactive">Inactive</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="status" data-value="locked">Locked</div>
    `;
}

function updateDropdownsForGroups(sortDropdown, filterDropdown) {
    sortDropdown.innerHTML = `
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="name-asc">Name (A to Z)</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="name-desc">Name (Z to A)</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="gid">GID</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="type">Type</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-sort="members">Members</div>
    `;

    filterDropdown.innerHTML = `
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="type" data-value="system">System Groups</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="type" data-value="user">User Groups</div>
        <div class="border-t border-gray-100"></div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="status" data-value="active">Active</div>
        <div class="p-2 text-sm text-gray-500 hover:bg-gray-50 cursor-pointer" data-filter="status" data-value="inactive">Inactive</div>
    `;
}

function attachSortListeners() {
    const sortOptions = document.querySelectorAll('.sort-dropdown div[data-sort]');
    const sortDropdown = document.querySelector('.sort-dropdown');
    
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            const sortType = this.dataset.sort;
            const activeTable = document.querySelector('.overflow-x-auto:not(.hidden)');
            sortTable(sortType, activeTable);
            sortDropdown.classList.add('hidden');
        });
    });
}

function sortTable(sortType, table) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        const isGroupTable = table.id === 'groupsTable';
        
        switch(sortType) {
            case 'name-asc':
                return a.querySelector('td:first-child').textContent.localeCompare(b.querySelector('td:first-child').textContent);
            case 'name-desc':
                return b.querySelector('td:first-child').textContent.localeCompare(a.querySelector('td:first-child').textContent);
            case 'gid':
                if (isGroupTable) {
                    return Number(a.querySelector('td:nth-child(2)').textContent) - Number(b.querySelector('td:nth-child(2)').textContent);
                }
                break;
            case 'type':
                return a.querySelector('td:nth-child(3)').textContent.localeCompare(b.querySelector('td:nth-child(3)').textContent);
            case 'members':
                if (isGroupTable) {
                    return a.querySelector('td:nth-child(4)').textContent.localeCompare(b.querySelector('td:nth-child(4)').textContent);
                }
                break;
            case 'login':
                if (!isGroupTable) {
                    return a.querySelector('td:nth-child(5)').textContent.localeCompare(b.querySelector('td:nth-child(5)').textContent);
                }
                break;
            case 'status':
                const statusCol = isGroupTable ? 5 : 6;
                return a.querySelector(`td:nth-child(${statusCol})`).textContent.localeCompare(b.querySelector(`td:nth-child(${statusCol})`).textContent);
            default:
                return 0;
        }
    });

    rows.forEach(row => tbody.appendChild(row));
}

function attachFilterListeners() {
    const filterOptions = document.querySelectorAll('.filter-dropdown div[data-filter]');
    const filterDropdown = document.querySelector('.filter-dropdown');
    
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            const activeTable = document.querySelector('.overflow-x-auto:not(.hidden)');
            filterTable(filterType, filterValue, activeTable);
            filterDropdown.classList.add('hidden');
        });
    });
}

function filterTable(filterType, filterValue, table) {
    const rows = table.querySelectorAll('tbody tr');
    const isGroupTable = table.id === 'groupsTable';
    
    rows.forEach(row => {
        let match = false;
        switch(filterType) {
            case 'type':
                const role = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                if (isGroupTable) {
                    match = (filterValue === 'system' && role.includes('system')) ||
                           (filterValue === 'user' && role.includes('user'));
                } else {
                    match = (filterValue === 'service' && role.includes('service')) ||
                           (filterValue === 'system' && role.includes('superuser')) ||
                           (filterValue === 'user' && role.includes('user'));
                }
                break;
            case 'status':
                const statusCol = isGroupTable ? 5 : 6;
                const status = row.querySelector(`td:nth-child(${statusCol})`).textContent.toLowerCase();
                match = status.includes(filterValue.toLowerCase());
                break;
            default:
                match = true;
        }
        row.style.display = match ? '' : 'none';
    });
}
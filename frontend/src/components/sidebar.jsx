

import { useState, useRef, useEffect } from "react";
import {
  Search,
  DollarSign,
  CreditCard,
  Settings,
  HelpCircle,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Sidebar({user}) {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // Active route logic
  const active =
    location.pathname === "/expenses"
      ? "Expense"
      : location.pathname === "/incomes"
      ? "Income"
      : "Dashboard";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout=()=>{
    console.log("Logging out...");
     localStorage.removeItem('token');
     localStorage.removeItem('user');
     setCollapsed(false);
     navigate('/login');
  }
  console.log("User in Sidebar:", user); // Add this line to log the user objectuser);
  const {name:username="User",email="hr7650074@gmail.com"}=user||{};
   const initial=username.charAt(0).toUpperCase()||"U";

  return (
    <div 
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-full bg-white m-3 p-4 flex flex-col justify-between rounded-2xl shadow-md transition-all duration-300`}
    >
      {/* Top */}
      <div>
        {/* Toggle + Logo */}
        <div className="flex justify-between items-center mb-4">
          {!collapsed && (
            <img
              src="image2.png"
              alt="Logo"
              className="w-28 cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-200"
          >
            ☰
          </button>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="flex items-center bg-gray-200 rounded-lg px-3 py-2 mb-4">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none ml-2 text-sm w-full"
            />
          </div>
        )}

        {/* Menu */}
        <div className="space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={active}
            collapsed={collapsed}
            onClick={() => navigate("/")}
          />

          <SidebarItem
            icon={<DollarSign size={18} />}
            label="Income"
            active={active}
            collapsed={collapsed}
            onClick={() => navigate("/incomes")}
          />

          <SidebarItem
            icon={<CreditCard size={18} />}
            label="Expense"
            active={active}
            collapsed={collapsed}
            onClick={() => navigate("/expenses")}
          />
        </div>
      </div>

      {/* Bottom */}
      <div>
        <div className="space-y-2 mb-4">
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<HelpCircle size={18} />}
            label="Help"
            collapsed={collapsed}
          />
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setOpen(!open)}
            className={`flex items-center ${
              collapsed ? "justify-center" : "gap-2"
            } p-2 bg-white rounded-xl shadow-sm cursor-pointer hover:bg-gray-50`}
          >
            <div className="w-10 h-10 bg-orange-500 text-white flex items-center justify-center rounded-full font-semibold">
                  {initial}
                </div>

            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium">{username}</p>
                <p className="text-xs text-gray-500">
                  {email}
                </p>
              </div>
            )}
          </div>

          {/* Dropdown */}
          {open && !collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{duration:0.5}}
              className="absolute bottom-12 left-0 w-full bg-white rounded-xl shadow-lg p-2 space-y-1 z-50"
            >
                                   
                    <div>
                      <p className="text-sm font-medium text-gray-800">{username}</p>
                      <p className="text-xs text-gray-500">
                        {email}
                      </p>
                    </div>
              <DropdownItem icon={<User size={16} />} label="Profile" />
              <DropdownItem icon={<Settings size={16} />} label="Account" />
              <hr />
              <DropdownItem onButtonClick={handleLogout}
                icon={<LogOut size={16} />}
                label="Logout"
                danger
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, active, onClick, collapsed }) {
  const isActive = active === label;

  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      
      className={`flex items-center ${
        collapsed ? "justify-center" : "gap-3"
      } p-2 rounded-lg cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-[0_4px_14px_rgba(255,115,0,0.4)]"
            : "hover:bg-gradient-to-r from-orange-100 to-orange-200 text-gray-700"
        }
      `}
    >
      <div className={isActive ? "text-white" : "text-gray-600"}>
        {icon}
      </div>

      {!collapsed && (
        <span className="text-sm font-medium">{label}</span>
      )}
    </motion.div>
  );
}

/* Dropdown Item */
function DropdownItem({ icon, label, danger,onButtonClick}) {
  return (
    <div
        onClick={onButtonClick}
      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}
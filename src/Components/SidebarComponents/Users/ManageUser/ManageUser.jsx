import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { exportExcel } from './excelExport'; // Import your Excel export function
import { useAuth } from '../../../../provider/AuthProvider/AuthProvider';
import { UserContext } from '../../../../provider/UsersProvider/UsersProvider';
import PDFDownload from '../../../Shared/PDFDownload/PDFDownload';
 // Import useAuth hook

const ManageMember = () => {
  const { isAuthenticated } = useAuth(); // Using isAuthenticated state from AuthContext
  const [members, setMembers] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState({});
  const {users} = useContext(UserContext)
  // Extract unique dashboard_inventory values
  const uniqueDashboardRoles = [...new Set(users.map(menu => menu.role))];
  useEffect(() => {
    if (isAuthenticated) {
      fetchMembers();
    }
  }, [isAuthenticated]); // Fetch members only if user is authenticated

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL}/get-user`);
      setMembers(response.data);
      // Initialize the selectedStatus and isButtonDisabled state for each member
      setSelectedStatus(Object.fromEntries(response.data.map(member => [member.id, ""])));
      setIsButtonDisabled(Object.fromEntries(response.data.map(member => [member.id, true])));
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_URL}/update-user/${id}`, { newStatus: selectedStatus[id] });
      // Assuming the backend returns updated data, you can also update the state here
      fetchMembers();
      setSelectedStatus(prevState => ({ ...prevState, [id]: '' }));
      setIsButtonDisabled(prevState => ({ ...prevState, [id]: true }));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_URL}/delete-user/${id}`);
      // Assuming the backend returns updated data, you can also update the state here
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const handleStatusChange = (e, id) => {
    const value = e.target.value;
    setSelectedStatus(prevState => ({ ...prevState, [id]: value }));
    setIsButtonDisabled(prevState => ({ ...prevState, [id]: value === '' }));
  };

  const handleExportExcel = () => {
    // Call your function to export data as Excel
    exportExcel(members);
  };

  
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <h1 >Manage Members</h1>
        <div className="flex mb-4">
          <button onClick={handleExportExcel} >
            Excel Sheet
          </button>
          < PDFDownload
        Products={members}
        selectedProperties={[
        "username",
        "role",
      ]}
        propertyDisplayNames={{
          username:"Username",
          role:"Status",
        }}
        fileName="User List" // Dynamic filename
      />
        </div>
        <table >
          <thead>
            <tr>
              <th >
                ID
              </th>
              <th >
                Email
              </th>
              <th >
                Status
              </th>
              <th >
                Actions
              </th>
            </tr>
          </thead>
          <tbody >
            {members?.map((member) => (
              <tr key={member.id}>
                <td>
                  {member.id}
                </td>
                <td>
                  {member.username}
                </td>
                <td>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {member.role}
                  </span>
                </td>
                <td>
                  <select
                    value={selectedStatus[member.id]}
                    onChange={(e) => handleStatusChange(e, member.id)}
                    className="block p-0 focus:ring-white focus:border-white sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select Status</option>
                    {
  uniqueDashboardRoles.map((role) => <option key={role} value={role}>{role}</option>)
}

                  </select>
                  <button
                    onClick={() => handleUpdateStatus(member.id)}
                    className={` ${isButtonDisabled[member.id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600'}`}
                    // TODO  Button Style
                    disabled={isButtonDisabled[member.id]}
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                   
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMember;

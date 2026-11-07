
import { useEffect, useState } from "react";
import { allUsers } from "../services/authServices";


const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await allUsers();
                setUsers(response.data.users);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return <div className="p-8 text-white">Loading users...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-950 p-6 text-white">
            <h1 className="mb-6 text-3xl font-bold">Manage Users</h1>

            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-300">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-t border-gray-800">
                                <td className="p-4">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">
                                    <span className={`rounded-full px-3 py-1 text-sm ${
                                        user.role === "admin"
                                            ? "bg-purple-500/20 text-purple-400"
                                            : "bg-blue-500/20 text-blue-400"
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {new Date(user.createdAt).toLocaleDateString("en-IN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <p className="p-6 text-center text-gray-400">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default Users;

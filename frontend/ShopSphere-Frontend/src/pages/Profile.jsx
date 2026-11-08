import { Mail, ShieldCheck, UserRound } from "lucide-react";
import { useSelector } from "react-redux";

const Profile = () => {
    const user = useSelector((state) => state.auth.user);

    return (
        <main className="min-h-screen px-5 py-12 text-white md:px-10">
            <div className="mx-auto max-w-4xl">
                <p className="text-sm font-medium text-purple-400">YOUR ACCOUNT</p>
                <h1 className="mt-2 text-3xl font-bold md:text-4xl">My Profile</h1>
                <p className="mt-2 text-gray-400">
                    View your account information.
                </p>

                <section className="mt-8 rounded-2xl border border-white/10 bg-[#181818] p-6 sm:p-8">
                    <div className="flex flex-col items-center gap-5 border-b border-white/10 pb-8 sm:flex-row">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt=""
                                className="h-20 w-20 rounded-full border border-white/10 object-cover"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/15 text-purple-300">
                                <UserRound size={34} />
                            </div>
                        )}
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-semibold">
                                {user?.name || "ShopSphere customer"}
                            </h2>
                            <p className="mt-1 text-sm capitalize text-gray-400">
                                {user?.role || "user"} account
                            </p>
                        </div>
                    </div>

                    <dl className="grid gap-5 pt-6 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <UserRound className="mt-0.5 shrink-0 text-purple-300" size={19} />
                            <div>
                                <dt className="text-sm text-gray-400">Full name</dt>
                                <dd className="mt-1 font-medium">{user?.name || "Not provided"}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="mt-0.5 shrink-0 text-purple-300" size={19} />
                            <div>
                                <dt className="text-sm text-gray-400">Email address</dt>
                                <dd className="mt-1 break-all font-medium">{user?.email || "Not provided"}</dd>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 shrink-0 text-purple-300" size={19} />
                            <div>
                                <dt className="text-sm text-gray-400">Account type</dt>
                                <dd className="mt-1 font-medium capitalize">{user?.role || "user"}</dd>
                            </div>
                        </div>
                    </dl>
                </section>
            </div>
        </main>
    );
};

export default Profile;

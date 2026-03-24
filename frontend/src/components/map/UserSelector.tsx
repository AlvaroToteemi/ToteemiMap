type Props = {
    users: { id: string; color: string }[]
    currentUserId: string | null
    onChange: (userId: string) => void
}

export default function UserSelector({ users, currentUserId, onChange }: Props) {
    return (
        <select
            value={currentUserId || ""}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="" disabled>Selecciona usuario</option>

            {users.map(user => (
                <option key={user.id} value={user.id}>
                    {user.id}
                </option>
            ))}
        </select>
    )
}
type Props = {
    isTracking: boolean
    onStart: () => void
    onStop: () => void
}

export default function TrackingControls({ isTracking, onStart, onStop }: Props) {
    return (
        <div>
            {!isTracking ? (
                <button onClick={onStart}>Start</button>
            ) : (
                <button onClick={onStop}>Stop</button>
            )}
        </div>
    )
}
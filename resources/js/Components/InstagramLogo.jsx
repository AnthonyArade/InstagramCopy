export default function InstagramLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 1000 1000"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <radialGradient id="instagram-gradient" cx="30%" cy="110%">
                    <stop offset="0%" stopColor="#feda75" />
                    <stop offset="5%" stopColor="#fa7e1e" />
                    <stop offset="45%" stopColor="#d92e7f" />
                    <stop offset="60%" stopColor="#9b36b7" />
                    <stop offset="90%" stopColor="#515bd4" />
                </radialGradient>
            </defs>
            <rect
                width="1000"
                height="1000"
                rx="200"
                fill="url(#instagram-gradient)"
            />
            <g transform="translate(500, 500)" fill="white">
                {/* Camera circle */}
                <circle cx="0" cy="0" r="280" fill="none" stroke="white" strokeWidth="60" />

                {/* Lens */}
                <circle cx="0" cy="0" r="160" fill="none" stroke="white" strokeWidth="50" />

                {/* Flash */}
                <rect x="220" y="-120" width="70" height="70" rx="15" fill="white" />
            </g>
        </svg>
    );
}

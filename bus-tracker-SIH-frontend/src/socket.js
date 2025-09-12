import { io } from 'socket.io-client';

const socket = io('http://localhost:8000'); // Adjust if your backend URL is different

export default socket;
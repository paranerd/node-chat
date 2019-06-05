class Streamer {
	constructor(config, socket) {
		var self = this;
		this.config = config;
		this.socket = socket;
		this.audioCtx = null;
		this.mediaStream = null;
		this.recorder = null;
		this.recording = false;
	}

	async record() {
		try {
			let stream = await navigator.mediaDevices.getUserMedia({audio: true});

			this.recording = true;

			this.audioCtx = new AudioContext();

			// Create an audio node from the microphone incoming stream
			this.mediaStream = this.audioCtx.createMediaStreamSource(stream);

			this.recorder = this.audioCtx.createScriptProcessor(this.config.bufferSize, 1, 1);

			this.socket.emit('start', {});

			this.recorder.onaudioprocess = (e) => {
				let raw = e.inputBuffer.getChannelData(0);
				let array = new Float32Array(raw);

				// raw == array; lengths ==; contents ==; constructors ==; typeof ==; ... yet, they're different...

				this.socket.emit('sound', {chunk: array.buffer});
			}

			// Connect the recorder
			this.mediaStream.connect(this.recorder);
			this.recorder.connect(this.audioCtx.destination);
		} catch (e) {
			console.log(e);
		}
	}

	stop() {
		console.log("Stopping recording...");
		// Stop recording
		this.recorder.disconnect(this.audioCtx.destination);
		this.mediaStream.disconnect(this.recorder);
		this.socket.emit('stop', {});
		this.audioCtx = null;
	}

	isRecording() {
		return !! this.audioCtx;
	}
}

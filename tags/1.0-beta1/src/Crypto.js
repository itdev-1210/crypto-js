var Crypto = function () {

	var base64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

	return {
		util: {

			// Bit-wise rotate left
			rotl: function (n, b) {
				return (n << b) | (n >>> (32 - b));
			},

			// Bit-wise rotate right
			rotr: function (n, b) {
				return (n << (32 - b)) | (n >>> b);
			},

			// Swap big-endian to little-endian and vice versa
			endian: function (n) {

				// If number given, swap endian
				if (n.constructor == Number) {
					return this.rotl(n,  8) & 0x00FF00FF |
					       this.rotl(n, 24) & 0xFF00FF00;
				}

				// Else, assume array and swap all items
				for (var i = 0; i < n.length; i++)
					n[i] = this.endian(n[i]);
				return n;

			},

			// Convert a string to a byte array
			string_bytes: function (str) {
				var bytes = [];
				for (var i = 0; i < str.length; i++)
					bytes.push(str.charCodeAt(i));
				return bytes;
			},

			// Convert a byte array to a string
			bytes_string: function (bytes) {
				var str = [];
				for (var i = 0; i < bytes.length; i++)
					str.push(String.fromCharCode(bytes[i]));
				return str.join("");
			},

			// Convert a string to big-endian 32-bit words
			string_words: function (str) {
				var words = [];
				for (var c = 0, b = 0; c < str.length; c++, b += 8)
					words[b >>> 5] |= str.charCodeAt(c) << (24 - b % 32);
				return words;
			},

			// Convert a byte array to big-endian 32-bits words
			bytes_words: function (bytes) {
				var words = [];
				for (var i = 0, b = 0; i < bytes.length; i++, b += 8)
					words[b >>> 5] |= bytes[i] << (24 - b % 32);
				return words;
			},

			// Convert big-endian 32-bit words to a byte array
			words_bytes: function (words) {
				var bytes = [];
				for (var b = 0; b < words.length * 32; b += 8)
					bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
				return bytes;
			},

			// Convert a byte array to a hex string
			bytes_hex: function (bytes) {
				var hex = [];
				for (var i = 0; i < bytes.length; i++) {
					hex.push((bytes[i] >>> 4).toString(16));
					hex.push((bytes[i] & 0xF).toString(16));
				}
				return hex.join("");
			},

			// Convert a hex string to a byte array
			hex_bytes: function (hex) {
				var bytes = [];
				for (var c = 0; c < hex.length; c += 2)
					bytes.push(parseInt(hex.substr(c, 2), 16));
				return bytes;
			},

			// Convert a byte array to a base-64 string
			bytes_base64: function (bytes) {

				var base64 = [],
				    overflow;

				for (var i = 0; i < bytes.length; i++) {
					switch (i % 3) {
						case 0:
							base64.push(base64map.charAt(bytes[i] >>> 2));
							overflow = (bytes[i] & 0x3) << 4;
							break;
						case 1:
							base64.push(base64map.charAt(overflow | (bytes[i] >>> 4)));
							overflow = (bytes[i] & 0xF) << 2;
							break;
						case 2:
							base64.push(base64map.charAt(overflow | (bytes[i] >>> 6)));
							base64.push(base64map.charAt(bytes[i] & 0x3F));
							overflow = -1;
					}
				}

				// Encode overflow bits, if there are any
				if (overflow != undefined && overflow != -1)
					base64.push(base64map.charAt(overflow));

				// Add padding
				while (base64.length % 4 != 0) base64.push("=");

				return base64.join("");

			},

			// Convert a base-64 string to a byte array
			base64_bytes: function (base64) {

				// Remove non-base-64 characters
				base64 = base64.replace(/[^A-Z0-9+\/]/ig, "");

				var bytes = [];

				for (var i = 0; i < base64.length; i++) {
					switch (i % 4) {
						case 1:
							bytes.push((base64map.indexOf(base64.charAt(i - 1)) << 2) |
							           (base64map.indexOf(base64.charAt(i)) >>> 4));
							break;
						case 2:
							bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0xF) << 4) |
							           (base64map.indexOf(base64.charAt(i)) >>> 2));
							break;
						case 3:
							bytes.push(((base64map.indexOf(base64.charAt(i - 1)) & 0x3) << 6) |
							           (base64map.indexOf(base64.charAt(i))));
							break;
					}
				}

				return bytes;

			}

		},
		mode: {}
	};

}();

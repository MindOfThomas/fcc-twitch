var url = 'https://api.twitch.tv/kraken/channels/';
var channels = ['freecodecamp', 'storbeck', 'terakilobyte', 'test_channel', 'brunofin', 'comster404'];
function addChannel(channel) {
	if(channels.indexOf(channel) === -1) {
		channels.push(channel);
		$('#channels')[0].appendChild(renderChannel(channel));
		doAjax(channel, channels.length - 1);
		saveChannels();
	}
}
function saveChannels() {
	if(localStorage) {
		localStorage.setItem('TwitchChannels', JSON.stringify(channels));
	}
}
function loadChannels() {
	if(localStorage) {
		channels = JSON.parse(localStorage.getItem('TwitchChannels')) || channels;
	}
}
function renderChannels() {
	for(var i = 0; i < channels.length; i++) {
		$('#channels')[0].appendChild(renderChannel(channels[i]));
	}
}
function renderChannel(channel) {
	var index = channels.indexOf(channel);

	var item = document.createElement('li');
	item.classList.add('col-xs-12');

	var anchor = document.createElement('a');
	anchor.href = 'https://twitch.tv/' + channel;
	anchor.target = '_blank';

	var imgContainer = document.createElement('div');
	imgContainer.classList.add('col-xs-1');

	var img = document.createElement('img');
	img.classList.add('img-responsive');
	img.id = 'chn' + index + 'img';
	img.src = 'http://dummyimage.com/50x50/ecf0e7/5c5457.jpg&text=0x3F';

	var content = document.createElement('div');
	content.classList.add('col-xs-10');

	var title = document.createElement('h4');
	title.id = 'chn' + index + 'name';
	title.appendChild(document.createTextNode(channel));

	var stream = document.createElement('small');
	stream.id = 'chn' + index + 'stream';

	var statusContainer = document.createElement('div');
	statusContainer.classList.add('col-xs-1');

	var status = document.createElement('i');
	status.classList.add('status');
	status.id = 'chn' + index + 'status';

	statusContainer.appendChild(status);

	content.appendChild(title);
	content.appendChild(stream);

	imgContainer.appendChild(img);

	anchor.appendChild(imgContainer);
	anchor.appendChild(content);
	anchor.appendChild(statusContainer);

	item.appendChild(anchor);

	return item;
}
function updateChannel(channel, i, data) {
	if(data.error) {
		// Remove the link to this closed account but keep its children elements
		$('#chn' + i + 'stream').parents('a').replaceWith($('#chn' + i + 'stream').parents('a').children());

		$('#chn' + i + 'stream').text('Account Closed');
		$('#chn' + i + 'name').addClass('closed');
		$('#chn' + i + 'status').addClass('glyphicon glyphicon-off status off');
		$('#chn' + i + 'status').removeClass('on');
		return;
	}
	$('#chn' + i + 'img').attr('src', data.logo);
	$('#chn' + i + 'name').text(data.display_name);
	$('#chn' + i + 'stream').text(data.status || 'Offline');
	$('#chn' + i + 'status').addClass('glyphicon glyphicon-off status');
	$('#chn' + i + 'status').addClass(data.status !== null ? 'on' : 'off');
	$('#chn' + i + 'status').removeClass(data.status !== null ? 'off' : 'on');
}
function doAjax(channel, i) {
	$.ajax({
		url: url + channels[i],
		type: 'GET',
		dataType: 'JSONP',
		success: function(data) {
			updateChannel(channels[i], i, data);
		}
	});
}

$(document).ready(function() {
	$('#addChannel').on('click', function() {
		var channelVal = $('#textbox').val();
		if(channelVal === '') {
			$('#group').addClass('has-error');
			$('#message').text("Enter a channel's name");
			return;
		}
		$('#group').removeClass('has-error');
		$('#message').text('');
		addChannel(channelVal);
	});
	$("#textbox").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#addChannel").click();
	    }
	});
	loadChannels();
	renderChannels();
	for(var i = 0; i < channels.length; i++) {
		doAjax(channels[i], i);
	}
});

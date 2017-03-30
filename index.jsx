var Greeting = React.createClass({
	render: function() {
		var picture =  <div className="media"> <a href="gallery_170301.html"><img src="images/170301/thumbs/01.jpg" alt="" title="This right here is a caption." /><span className="etiqueta">1ª Fecha Open XCO<br />1ª Manga</span></a> </div>;
		var rows = [];
		for (var i=0; i < 12; i++) {
			rows.push(picture);
		}
		return <div className="content gallery-wrapper">{rows}</div>;
	}
	});


ReactDOM.render(
	<Greeting/>,
	document.getElementById('gallery-wrapper')
	);
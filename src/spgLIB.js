(function(){
    let spgLIB = {
        getRandomColor: function(){
            const getByte = _ => 55 + Math.round(Math.random() * 200);
            return `rgba(0,${getByte()},${getByte()},.8)`;
        },
    
        getRandomInt : function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    
        drawRectangle : function(ctx,x,y,width,height,fillStyle="black",lineWidth=0,strokeStyle="black"){
            ctx.save();
            ctx.beginPath();
            ctx.rect(x,y,width,height);
            ctx.closePath();
            ctx.fillStyle = fillStyle;
            ctx.fill();
            if (lineWidth > 0)
            {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.stroke();
            }
            ctx.restore();
        },

        drawLine : function(ctx,x1,y1,x2,y2,strokeStyle="white",lineWidth=1){
            ctx.save();
            ctx.moveTo(x1,y1);
            ctx.lineTo(x2,y2);
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
            ctx.restore();
        }
    };

    if(window){
        window["spgLIB"] = spgLIB;
    }
    else{
        throw "window is not defined!";
    }
})();
/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

qx.Theme.define("turismo.theme.Appearance",
{
  extend : qx.theme.modern.Appearance,

  appearances :
  {
    'token' : 'combobox',
    'tokenitem' :
    {
      include : 'listitem',
      style : function(states) {
        return {
          decorator : 'group',
          textColor : states.hovered ? '#314a6e' : states.head ? '#FF0000' : '#000000',
          height : 18,
          padding : [1, 6, 1, 6],
          margin : 0,
          icon : states.close ? "decoration/window/close-active.png" : "decoration/window/close-inactive.png"
        };
      }
    }
  }
});
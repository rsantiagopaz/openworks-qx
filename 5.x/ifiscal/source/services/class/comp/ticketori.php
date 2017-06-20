<?php

  dl("php_h7v52.dll");

  $port = IF_OPEN("COM2",9600);

  if ( $port == -1) 
  {   echo "impresora ocupada";   return;  }

  $err = IF_WRITE("@OpenFiscalReceipt|T|T");
  $err = IF_WRITE("@PrintLineItem|Eveready 1.5V|55.355|1.9895|10.5|M|0|0|T");
  $err = IF_WRITE("@PrintLineItem|Eveready 9V|1.0|2.50|21.0|M|0.0|0|T");
  $err = IF_WRITE("@TotalTender|Efectivo|20.00|T|0");
  $err = IF_WRITE("@Subtotal|P|Subtotal|1|");
  $err = IF_WRITE("@CloseFiscalReceipt");

  $nTiquet = IF_READ(3);

  $err =IF_CLOSE();

?>

<?php

  dl("php_h715v52ts.dll");

  $port = IF_OPEN("COM2",9600);

  if ( $port == -1) 
  {   echo "impresora ocupada";   return;  }

  $nError = IF_WRITE("@OpenFiscalReceipt|T|T");
  $nError = IF_WRITE("@PrintLineItem|Mouse Genius XScrol|1.0|4.08|10.50|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Patchcord Cat.5E Gr|5.0|4.10|21.00|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Microfono NG-H300 N|1.0|4.12|21.00|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Mouse Genius Netscr|1.0|4.12|10.50|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Ventilador Cyber Co|2.0|4.12|21.00|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Lector 3.5 MultiCar|2.0|4.22|21.00|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Teclado Noganet Esp|2.0|4.30|10.50|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Antena SMA Kozumi W|2.0|4.33|21.00|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Teclado Ecovision W|1.0|4.39|10.50|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Limpiador para Pant|1.0|4.44|21.00|M|0.0|0|B");
  $nError = IF_WRITE("@PrintLineItem|Auricular Genius Mo|1.0|4.46|21.00|M|0.0|0|B");
  $nError = IF_WRITE("@Subtotal|P|Subtotal|0");
  $nError = IF_WRITE("@TotalTender|Efectivo|100.00|T|0");
  $nError = IF_WRITE("@CloseFiscalReceipt");

  $nTiquet = IF_READ(3);

  $err =IF_CLOSE();

?>

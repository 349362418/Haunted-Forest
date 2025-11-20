#include <LedControl.h>

int PIN_DIN= 7, PIN_CS= 6, PIN_CLK= 5 ;
LedControl lc = LedControl(PIN_DIN, PIN_CLK, PIN_CS, 1);

byte surprise[8] = {B00000000,B11000000,B11100010,B11110111,B11110111,B11100010,B11000000,B00000000};

void showGrid(byte ch [8]){
  for(int row =0; row<8; row++){
    lc.setRow(0, row, ch[row]);
  }
  delay(100);
}

void setup() {
  // put your setup code here, to run once:
  lc.shutdown(0,false); // wake up the led
  lc.setIntensity(0,15);
  lc.clearDisplay(0);

}

void loop() {
  // put your main code here, to run repeatedly:
  //lc.setRow(0,0,test);
  //lc.setRow(0,7,test2);
  showGrid(surprise);

}

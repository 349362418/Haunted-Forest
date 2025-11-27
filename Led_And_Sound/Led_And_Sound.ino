#include <LedControl.h>

// www.elegoo.com
// 2018.10.24
/*
  LED1 should be lit, showing power. LED2 indicates sound input, and the sensitivity is adjusted by potentiometer.
  There is a tiny screw on the blue potentiometer block that you can use for adjustment. Turning that
  clockwise lowers the potentiometer value, while counter-clockwise raises the potentiometer value.
  Use the potentiometer to adjust the Sound Sensor sensitivity. Turn the potentiometer
  several rotations until you see the LED2 extinguish (or just faintly blink). This might be slightly greater than
  500, if you are also watching Serial Monitor (inital adjustment), or, Serial Plotter (the latter is prefererd for observation).
  Special thanks to user CRomer, for his input and hard work!
*/
long previousBlinkMillis = 0;   // Stores the last time the LED state was updated
const long blinkInterval = 100; // Time (in milliseconds) the LED stays ON or OFF (100ms = 0.1 second)
int PIN_DIN= 7, PIN_CS= 6, PIN_CLK= 5 ;
LedControl lc = LedControl(PIN_DIN, PIN_CLK, PIN_CS, 1);

int  sensorAnalogPin = A0;    // Select the Arduino input pin to accept the Sound Sensor's analog output 
int  sensorDigitalPin = 3;    // Select the Arduino input pin to accept the Sound Sensor's digital output
int  analogValue = 0;         // Define variable to store the analog value coming from the Sound Sensor
int  digitalValue;            // Define variable to store the digital value coming from the Sound Sensor
int  Led13 = 13;              // Define LED port; this is the LED built in to the Arduino (labled L)
                              // When D0 from the Sound Sensor (connnected to pin 3 on the
                              // Arduino) sends High (voltage present), L will light. In practice, you
                              // should see LED13 on the Arduino blink when LED2 on the Sensor is 100% lit.
                              
byte surprise[8] = {B00000000,B11000000,B11100010,B11110111,B11110111,B11100010,B11000000,B00000000};

void showGrid(byte ch [8]){
  for(int row =0; row<8; row++){
    lc.setRow(0, row, ch[row]);
  }
  delay(100);
}

void setup()
{
  Serial.begin(9600);               // The IDE settings for Serial Monitor/Plotter (preferred) must match this speed
  pinMode(sensorDigitalPin,INPUT);  // Define pin 3 as an input port, to accept digital input
  pinMode(Led13,OUTPUT);            // Define LED13 as an output port, to indicate digital trigger reached

  lc.shutdown(0,false); // wake up the led
  lc.setIntensity(0,15);
  lc.clearDisplay(0);
}

void loop(){
  analogValue = analogRead(sensorAnalogPin); // Read the value of the analog interface A0 assigned to digitalValue 
  digitalValue=digitalRead(sensorDigitalPin); // Read the value of the digital interface 3 assigned to digitalValue 
  Serial.println(analogValue); // Send the analog value to the serial transmit interface
  

  // 1. Check the DIGITAL Trigger (D0 pin)
  if(digitalValue==HIGH)      // When the Sound Sensor sends signla, via voltage present, light LED13 (L)
  {
    // ⭐️ BLINKING LOGIC ⭐️
    // Check if the required time (blinkInterval) has passed since the last state change
    if (millis() - previousBlinkMillis >= blinkInterval) {
      // Save the current time as the last time the state was updated
      previousBlinkMillis = millis(); 
      
      // Toggle the LED state (HIGH to LOW, or LOW to HIGH)
      if (digitalRead(Led13) == LOW) {
        digitalWrite(Led13, HIGH);
      } else {
        digitalWrite(Led13, LOW);
      }
    }
    // The matrix display always shows 'surprise' as long as the digital signal is HIGH
    showGrid(surprise); 

  }
  else                      // Digital signal is LOW (sound level is below the sensor's internal threshold)
  {
    digitalWrite(Led13, LOW);
    lc.clearDisplay(0);  
  }
  
  delay(50);                  // Slight pause so that we don't overwhelm the serial interface
}
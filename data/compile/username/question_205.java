import java.util.Scanner;

class INIT_JAVA{
  public static void main(String[] args){
    Scanner input = new Scanner(System.in);
    String text = "";
    String[] output = "";
    
    text = input.nextLine();
    output = text.split(" ");
    
    System.out.print( output );
  }
}
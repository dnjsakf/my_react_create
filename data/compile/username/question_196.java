import java.util.*;

class Question_196{
  public static final Scanner scan = new Scanner(System.in);
  public static void main(String[] args){
    String str = scan.nextLine();
    int[] num = new int[str.length()];
    for(int i = 0; i < str.length(); i ++){
		num[i] = Integer.valueOf(str.charAt(i));
    }
    System.out.println( num[0] / num[1] );
  }
}
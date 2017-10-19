def test(K):
    data = [1, 0]
    for j in range(K):
        temp = data[1]
        data[1] += data[0]
        data[0] = temp
    print(data[0], data[1])

T = int(input())
for i in range(T):
    test(int(input()))

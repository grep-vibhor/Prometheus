get_version() {
cd /opt/sdp/jboss-10.1.0
>/opt/yodlee/latestbuild.txt
arr1=(`find . -maxdepth 6  -type d -name "deployments" |cut -d"/" -f2`)
LC="kk"
 count=${#arr1[@]}
for((k=0;k<count;k++))
do
cd ${arr1[k]}/deployments 
LOC=`ls -lrt   | grep ^l | awk -F '/' '{print $(NF-1)}'`
if [ "$LOC"  == "" ]
then
CI="NA"
cd ../../
else
BI="$LOC"
echo "$BI" >>/opt/yodlee/latestbuild.txt
cd ../../
fi
done
}

echo "################## Removing JBOSS rpm's##################"
remove_jboss() {
cd /opt/yodlee/
latestbuild=`grep -w $1 /opt/yodlee/latestbuild.txt`
echo $latestbuild
Count=`grep -w $1 /opt/yodlee/latestbuild.txt | wc -l`
if [ "$Count" == "1" ]
then
echo "removing below $1 builds"
rpm -qa | grep -w $1 | grep -v $latestbuild
ls | grep -w $1 | grep -v $latestbuild | xargs rm -rf

removingbuilds=`rpm -qa | grep -w $1 | grep -v $latestbuild`
if  [ "$removingbuilds" != "" ]; then
        rpm -qa | grep -w $1 | grep -v $latestbuild | xargs yum remove -y
else
        echo "no builds to remove"
fi
else
deployed_build=`echo "$latestbuild" | awk '{ print "-e " $0 }'`
rpm -qa | grep -w $1 | grep -v $deployed_build
ls | grep -w $1 | grep -v $deployed_build | xargs rm -rf

removingbuilds=`rpm -qa | grep -w $1 | grep -v $deployed_build`
if  [ "$removingbuilds" != "" ]; then
        rpm -qa | grep -w $1 | grep -v $deployed_build | xargs yum remove -y
else
        echo "no builds to remove"
fi
fi
}

remove_non_jboss() {
latestbuild=`rpm -qa | grep -w $1 |sort -g | tail -1`
echo $latestbuild
echo "removing below $1 builds"
rpm -qa | grep -w $1 | grep -v $latestbuild
latestrpm=`echo $latestbuild | cut -f1,2,3 -d'-'`
ls | grep -w $1 | grep -v $latestrpm | xargs rm -rf
removingbuilds=`rpm -qa | grep -w $1 | grep -v $latestbuild`

if [ "$removingbuilds" != "" ]; then
        rpm -qa | grep -w $1 | grep -v $latestbuild | xargs yum remove -y
else
        echo "no builds to remove"
fi
}


get_version
remove_jboss dc
remove_jboss dcservlets
remove_jboss alerts
#remove_jboss appscenter
#remove_jboss moneycenter
remove_jboss ycc
remove_jboss newsdk
#remove_non_jboss ytask
remove_jboss restserver
remove_non_jboss oltpdatabase
remove_non_jboss configdatabase
remove_non_jboss yccdatabase
remove_non_jboss paymentsdatabase

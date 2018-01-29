#coding:utf-8
from aliyunsdkcore.client import AcsClient
from aliyunsdkcore.request import RpcRequest
import commands
import oss2
import os

class OSS_resouce(object):
    def __init__(self):
        self.auth = oss2.Auth('LTAIPbl6650CGCWd','5bozPnpcPvquE5CtUTSz09KTGMLAv7')

    def bin_upload_files(self):
        self.bucket = oss2.Bucket(self.auth, 'http://oss-cn-beijing.aliyuncs.com', 'hn-web')
        self.file_list = os.listdir('./dist')
        for file in self.file_list:
            if os.path.exists('./dist/'+file):
                print file
                self.bucket.put_object_from_file('mtest/assets/js/{remote_file}'.format(remote_file = file),'{local_name}'.format(local_name = './dist/'+file))

        print 'update '+str(len(self.file_list))+' files'
if __name__ == '__main__':
    OSS_resouce().bin_upload_files()
 